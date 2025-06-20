import type pg from 'pg'

import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Config, Effect } from 'effect'

import { createNodePgPool } from './nodepg-pool.js'

type DrizzleClient = NodePgDatabase & {
  $client: pg.Pool
}

interface DrizzleNodePgClientImpl {
  readonly db: DrizzleClient
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

      return { db } satisfies DrizzleNodePgClientImpl
    }),
  },
) {}
