import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Data, Effect, Layer, Match, Redacted } from 'effect'
import pg from 'pg'
import { PostgresError } from 'pg-error-enum'

import * as schema from '../schema/index.js'
import { relations } from '../schema/realtions.js'

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

export class DatabaseConnectionLostError extends Data.TaggedError('DatabaseConnectionLostError')<{
  readonly cause: unknown
  readonly message: string
}> {}

const matchPgError = (cause: unknown): DatabaseError | null =>
  cause instanceof pg.DatabaseError
    ? Match.value(cause.code).pipe(
        Match.withReturnType<DatabaseError | null>(),
        Match.when(
          PostgresError.UNIQUE_VIOLATION,
          () => new DatabaseError({ cause, type: 'unique_violation' }),
        ),
        Match.when(
          PostgresError.FOREIGN_KEY_VIOLATION,
          () => new DatabaseError({ cause, type: 'foreign_key_violation' }),
        ),
        Match.when(
          PostgresError.CONNECTION_EXCEPTION,
          () => new DatabaseError({ cause, type: 'unique_violation' }),
        ),
        Match.orElse(() => null),
      )
    : null

export interface Config {
  ssl: boolean
  url: Redacted.Redacted
}

type Client = NodePgDatabase<typeof schema, typeof relations> & {
  $client: pg.Pool
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- todo
const makeService = ({ ssl, url }: Config) =>
  Effect.gen(function* () {
    const connection = yield* Effect.acquireRelease(
      Effect.sync(
        () =>
          new pg.Pool({
            connectionString: Redacted.value(url),
            connectionTimeoutMillis: 0,
            idleTimeoutMillis: 0,
            ssl: ssl,
          }),
      ),
      (pool) => Effect.promise(() => pool.end()),
    )

    yield* Effect.tryPromise({
      catch: (cause) =>
        new DatabaseConnectionLostError({
          cause,
          message: '[Database Client] Failed to connect',
        }),
      try: () => connection.query('SELECT 1'),
    }).pipe(
      Effect.timeoutFail({
        duration: '10 seconds',
        onTimeout: () =>
          new DatabaseConnectionLostError({
            cause: new Error('[Database client] Failed to connect: timeout'),
            message: '[Database client] Failed to connect: timeout',
          }),
      }),
      Effect.tap(() => Effect.logInfo('[Database client]: Connection to the database established')),
    )

    const setupConnectionListeners = Effect.zipRight(
      Effect.async<void, DatabaseConnectionLostError>((resume) => {
        connection.on('error', (cause) => {
          resume(
            Effect.fail(
              new DatabaseConnectionLostError({
                cause,
                message: cause.message,
              }),
            ),
          )
        })
        return Effect.sync(() => connection.removeAllListeners())
      }),
      Effect.logInfo('[Database client]: Connection listeners initialized'),
      { concurrent: true },
    )

    const db = drizzle({
      casing: 'snake_case',
      client: connection,
      relations,
      schema,
    })

    const execute = Effect.fn(<T>(fn: (client: Client) => Promise<T>) =>
      Effect.tryPromise({
        catch: (cause) => {
          const matchedPgError = matchPgError(cause)
          if (matchedPgError) {
            return matchedPgError
          }
          throw cause
        },
        try: () => fn(db),
      }),
    )

    return {
      execute,
      setupConnectionListeners,
    } as const
  })

type Shape = Effect.Effect.Success<ReturnType<typeof makeService>>

export class Database extends Effect.Tag('Database')<Database, Shape>() {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- todo
export const layer = (config: Config) => Layer.scoped(Database, makeService(config))
