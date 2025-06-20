import { Effect, Redacted, Runtime } from 'effect'
import pg from 'pg'

import { DatabaseConnectionError } from './database-errors.js'

export interface PgClientConfig {
  connectionString: Redacted.Redacted<string>
}

export const createNodePgPool = Effect.fn(function* (options: PgClientConfig) {
  const runSync = Runtime.runSync(yield* Effect.runtime<never>())

  const pgPool = yield* Effect.acquireRelease(
    // acquire
    Effect.sync(() => {
      const pool = new pg.Pool({
        application_name: 'node-postgres-pool',
        connectionString: Redacted.value(options.connectionString),
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 10_000,
        max: 10,
        min: 0,
      })

      pool.on('connect', () => runSync(Effect.logDebug('Connected to the database.')))
      pool.on('acquire', () =>
        runSync(Effect.logDebug('Acquired a database connection from the pool.')),
      )
      pool.on('release', () =>
        runSync(Effect.logDebug('Released the database connection back to the pool.')),
      )
      pool.on('remove', () =>
        runSync(Effect.logDebug('Removed the database connection from the pool.')),
      )
      pool.on('error', (error) => runSync(Effect.logWarning(error.message)))

      return pool
    }),
    // release
    (pool) =>
      Effect.promise(() => {
        pool.removeAllListeners()
        return pool.end()
      }).pipe(
        Effect.interruptible,
        Effect.timeoutOption('1 second'),
        Effect.andThen(Effect.logInfo('Closed database connection pool.')),
      ),
  )

  yield* Effect.tryPromise({
    catch: (cause) =>
      new DatabaseConnectionError({ cause, message: 'Failed to connect to database' }),
    try: () => pgPool.query('select 1'),
  }).pipe(
    Effect.timeoutFail({
      duration: '5 seconds',
      onTimeout: () =>
        new DatabaseConnectionError({
          cause: new Error('Database connection timed out'),
          message: 'Database connection timed out',
        }),
    }),
  )

  return { pool: pgPool } as const
})
