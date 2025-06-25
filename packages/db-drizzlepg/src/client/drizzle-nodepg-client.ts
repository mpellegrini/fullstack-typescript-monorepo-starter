import type pg from 'pg'

import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Config, Effect } from 'effect'

import { toTaggedErrorOrThrow } from './database-errors.js'
import { createNodePgPool } from './nodepg-pool.js'

type DrizzleClient = NodePgDatabase & {
  $client: pg.Pool
}

interface DrizzleNodePgClientImpl {
  readonly db: DrizzleClient
  readonly use: <T>(fn: (client: DrizzleClient) => Promise<T>) => Effect.Effect<T, Error>
}

export class DrizzleNodePgClient extends Effect.Service<DrizzleNodePgClient>()(
  'DrizzleNodePgClient',
  {
    scoped: Effect.gen(function* () {
      const { pool } = yield* createNodePgPool({
        connectionString: yield* Config.redacted('DB_CONNECTION_STRING'),
        // TODO: need to add additional connection config
      })

      const db = drizzle({
        casing: 'snake_case',
        client: pool,
        logger: false,
      })

      const use = Effect.fn(<T>(fn: (client: DrizzleClient) => Promise<T>) =>
        Effect.tryPromise({
          catch: (cause) => toTaggedErrorOrThrow(cause),
          try: () => fn(db),
        }),
      )

      return { db, use } satisfies DrizzleNodePgClientImpl
    }),
  },
) {}
