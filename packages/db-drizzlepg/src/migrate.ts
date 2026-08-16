import { migrate } from 'drizzle-orm/node-postgres/migrator'
import * as Effect from 'effect/Effect'

import { DrizzleNodePgClient } from './client/index.ts'

const program = Effect.gen(function* () {
  const { db } = yield* DrizzleNodePgClient
  yield* Effect.logInfo('Drizzle database migration starting...')
  yield* Effect.tryPromise(() => migrate(db, { migrationsFolder: './src/migrations' }))
  yield* Effect.logInfo('🎉 Drizzle database migration completed successfully!')
})

const main = program.pipe(Effect.provide(DrizzleNodePgClient.layer))

await Effect.runPromise(main)
