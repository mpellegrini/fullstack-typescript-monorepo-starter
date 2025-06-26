import { NodeRuntime } from '@effect/platform-node'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Effect } from 'effect'

import { DrizzleNodePgClient } from './client/index.js'

const program = Effect.gen(function* () {
  const { db } = yield* DrizzleNodePgClient
  yield* Effect.logInfo('Drizzle database migration starting...')
  yield* Effect.tryPromise(() => migrate(db, { migrationsFolder: './src/migrations' }))
  yield* Effect.logInfo('🎉 Drizzle database migration completed successfully!')
})

const main = program.pipe(Effect.provide(DrizzleNodePgClient.Default))

NodeRuntime.runMain(main)
