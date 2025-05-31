import { Context, Data, Effect, Layer, Redacted } from 'effect'
import pg from 'pg'

// see https://github.com/bmdavis419/notion-discord-notifications/blob/main/src/redis.ts
//     https://github.com/bmdavis419/notion-discord-notifications/blob/main/src/redis.ts
//     https://effect.website/play#7e9fe129bc61
//     https://github.com/floydspace/effect-aws/blob/192aad72a154951e5814f12cae90cc3d1b63621c/packages/commons/src/ServiceLogger.ts#L65-L77

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  cause?: unknown
  message?: string
}> {}

export interface PgClientConfig {
  readonly connectionString: Redacted.Redacted
  readonly loggingEnabled: boolean
  readonly ssl: boolean
}

const scopedDbConnectionResource = Effect.fn(function* (config: PgClientConfig) {
  return yield* Effect.acquireRelease(
    Effect.sync(
      () =>
        new pg.Pool({
          connectionString: Redacted.value(config.connectionString),
          connectionTimeoutMillis: 0,
          idleTimeoutMillis: 0,
          ssl: config.ssl,
        }),
    ).pipe(
      Effect.tap((connection) =>
        Effect.tryPromise({
          catch: (cause) =>
            new DatabaseError({
              cause,
              message: '[DataSource] Failed to connect',
            }),
          try: () => connection.query('SELECT 1'),
        }),
      ),
    ),
    (connection) =>
      Effect.promise(() => connection.end()).pipe(
        Effect.tap(() => Effect.logInfo('[DataSource]: Connection closed.')),
      ),
  )
})

export class DataSource extends Context.Tag('DataSource')<
  DataSource,
  {
    readonly db: pg.Pool
  }
>() {}

// : Effect.Effect<pg.Pool, DatabaseError, Scope.Scope>
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- todo
const make = (config: PgClientConfig) =>
  Effect.gen(function* () {
    return { db: yield* scopedDbConnectionResource(config) }
  })

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types -- todo
export const layer = (config: PgClientConfig) => Layer.scoped(DataSource, make(config))
