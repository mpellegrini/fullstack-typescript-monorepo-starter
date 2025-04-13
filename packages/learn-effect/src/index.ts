import type { EmptyRelations } from 'drizzle-orm'
import type { ExtractTableRelationsFromSchema } from 'drizzle-orm/_relations'
import type { PgTransaction } from 'drizzle-orm/pg-core'

import { type NodePgDatabase, type NodePgQueryResultHKT, drizzle } from 'drizzle-orm/node-postgres'
import {
  Cause,
  Context,
  Data,
  Effect,
  Exit,
  Layer,
  Option,
  Redacted,
  Runtime,
  Schedule,
} from 'effect'
import * as pg from 'pg'
import { PostgresError } from 'pg-error-enum'

import * as dbSchema from './db-schema.js'

// eslint-disable-next-line unicorn/throw-new-error -- false positive
export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly cause: pg.DatabaseError
  readonly type: 'connection_error' | 'foreign_key_violation' | 'unique_violation'
}> {
  public override toString(): string {
    return `DatabaseError: ${this.cause.message}`
  }

  public override get message(): string {
    return this.cause.message
  }
}

type Client = NodePgDatabase<typeof dbSchema> & {
  $client: pg.Pool
}

type TransactionClient = PgTransaction<
  NodePgQueryResultHKT,
  typeof dbSchema,
  EmptyRelations,
  ExtractTableRelationsFromSchema<typeof dbSchema, never>
>

type TransactionContextShape = <U>(
  fn: (client: TransactionClient) => Promise<U>,
) => Effect.Effect<U, DatabaseError>

export class TransactionContext extends Context.Tag('TransactionContext')<
  TransactionContext,
  TransactionContextShape
>() {
  public static readonly provide = (
    transaction: TransactionContextShape,
  ): (<A, E, R>(
    self: Effect.Effect<A, E, R>,
  ) => Effect.Effect<A, E, Exclude<R, TransactionContext>>) =>
    Effect.provideService(this, transaction)
}

const matchPgError = (error: unknown): DatabaseError | null => {
  if (error instanceof pg.DatabaseError && error.code) {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- not applicable
    switch (error.code as PostgresError) {
      case PostgresError.CONNECTION_EXCEPTION: {
        return new DatabaseError({ cause: error, type: 'connection_error' })
      }
      case PostgresError.FOREIGN_KEY_VIOLATION: {
        return new DatabaseError({ cause: error, type: 'foreign_key_violation' })
      }
      case PostgresError.UNIQUE_VIOLATION: {
        return new DatabaseError({ cause: error, type: 'unique_violation' })
      }
      default: {
        return null
      }
    }
  }
  return null
}

// eslint-disable-next-line unicorn/throw-new-error -- false positive
export class DatabaseConnectionLostError extends Data.TaggedError('DatabaseConnectionLostError')<{
  cause: unknown
  message: string
}> {}

export interface Config {
  ssl: boolean
  url: Redacted.Redacted
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- use inferred is preferred
const makeService = (config: Config) =>
  Effect.gen(function* () {
    const pool = yield* Effect.acquireRelease(
      Effect.sync(
        () =>
          new pg.Pool({
            connectionString: Redacted.value(config.url),
            connectionTimeoutMillis: 0,
            idleTimeoutMillis: 0,
            ssl: config.ssl,
          }),
      ),
      // eslint-disable-next-line @typescript-eslint/no-shadow -- this won't be am issue here
      (pool) => Effect.promise(() => pool.end()),
    )

    yield* Effect.tryPromise(() => pool.query('SELECT 1')).pipe(
      Effect.retry(
        Schedule.jitteredWith(Schedule.spaced('1.25 seconds'), { max: 1.5, min: 0.5 }).pipe(
          Schedule.tapOutput((output) =>
            Effect.logWarning(
              `[Database client]: Connection to the database failed. Retrying (attempt: ${output})`,
            ),
          ),
        ),
      ),
      Effect.tap(() =>
        Effect.logInfo('[Database client]: Connection to the database was established'),
      ),
      Effect.orDie,
    )

    const setupConnectionListeners = Effect.zipRight(
      Effect.async<void, DatabaseConnectionLostError>((resume) => {
        pool.on('error', (error) => {
          resume(
            Effect.fail(new DatabaseConnectionLostError({ cause: error, message: error.message })),
          )
        })

        return Effect.sync(() => pool.removeAllListeners('error'))
      }),
      Effect.logInfo('[Database client]: Connection error listeners initialized'),
      { concurrent: true },
    )
    const db = drizzle(pool, { casing: 'snake_case', schema: dbSchema })

    const execute = Effect.fn(<T>(fn: (client: Client) => Promise<T>) =>
      Effect.tryPromise({
        catch: (cause) => {
          const error = matchPgError(cause)
          if (error !== null) {
            return error
          }
          throw cause
        },
        try: () => fn(db),
      }),
    )

    const transaction = Effect.fn('Database.transaction')(
      <T, E, R>(txExecute: (tx: TransactionContextShape) => Effect.Effect<T, E, R>) =>
        Effect.runtime<R>().pipe(
          Effect.map((runtime) => Runtime.runPromiseExit(runtime)),
          Effect.flatMap((runPromiseExit) =>
            Effect.async<T, DatabaseError | E, R>((resume) => {
              db.transaction(async (tx: TransactionClient) => {
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any -- inferred is preferred here
                const txWrapper = (fn: (client: TransactionClient) => Promise<any>) =>
                  Effect.tryPromise({
                    catch: (cause) => {
                      const error = matchPgError(cause)
                      if (error !== null) {
                        return error
                      }
                      throw cause
                    },
                    try: () => fn(tx),
                  })
                const result = await runPromiseExit(txExecute(txWrapper))

                Exit.match(result, {
                  onFailure: (cause) => {
                    if (Cause.isFailure(cause)) {
                      resume(Effect.fail(Cause.originalError(cause) as E))
                    } else {
                      resume(Exit.die(cause))
                    }
                  },
                  onSuccess: (value) => {
                    resume(Effect.succeed(value))
                  },
                })
              }).catch((error_) => {
                const error = matchPgError(error_)
                resume(error === null ? Effect.die(error_) : Effect.fail(error))
              })
            }),
          ),
        ),
    )

    type ExecuteFn = <T>(
      fn: (client: Client | TransactionClient) => Promise<T>,
    ) => Effect.Effect<T, DatabaseError>

    const makeQuery =
      <A, E, R, Input = never>(
        queryFn: (execute: ExecuteFn, input: Input) => Effect.Effect<A, E, R>,
      ) =>
      (...args: [Input] extends [never] ? [] : [input: Input]): Effect.Effect<A, E, R> => {
        const input = args[0] as Input
        return Effect.serviceOption(TransactionContext).pipe(
          Effect.map((element) => Option.getOrNull(element)),
          Effect.flatMap((txOrNull) => queryFn(txOrNull ?? execute, input)),
        )
      }

    return {
      execute,
      makeQuery,
      setupConnectionListeners,
      transaction,
    } as const
  })

type Shape = Effect.Effect.Success<ReturnType<typeof makeService>>

export class Database extends Effect.Tag('Database')<Database, Shape>() {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- use inferred is preferred
export const layer = (config: Config) => Layer.scoped(Database, makeService(config))
