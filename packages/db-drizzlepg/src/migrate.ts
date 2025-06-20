import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Data, Effect, Logger } from 'effect'

import { DrizzleNodePgClient } from './effect-client/index.js'

class DrizzleMigrateError extends Data.TaggedError('DrizzleMigrateError')<{
  readonly cause: unknown
  readonly message: string
}> {}

const program = Effect.gen(function* () {
  const { db } = yield* DrizzleNodePgClient
  yield* Effect.logInfo('Drizzle database migration starting...')

  yield* Effect.tryPromise({
    catch: (cause) =>
      new DrizzleMigrateError({
        cause,
        message: cause instanceof Error ? cause.message : 'An unknown error occurred',
      }),
    try: () => migrate(db, { migrationsFolder: './src/migrations' }),
  })
  yield* Effect.logInfo('🎉 Drizzle database migration completed successfully!')
})

const runnable = program.pipe(
  Effect.provide(DrizzleNodePgClient.Default),
  Effect.provide(Logger.pretty),
)

const main = runnable.pipe(Effect.orDie)

await Effect.runPromise(main)
