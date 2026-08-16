import type pg from 'pg'

import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import * as Config from 'effect/Config'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { toTaggedErrorOrThrow } from './database-errors.ts'
import { createNodePgPool } from './nodepg-pool.ts'
// https://pbs.twimg.com/media/HHL_-UVXgAApwBr?format=jpg&name=4096x4096
type DrizzleClient = NodePgDatabase & {
  $client: pg.Pool
}

interface DrizzleNodePgClientImpl {
  readonly db: DrizzleClient
  readonly use: <T>(fn: (client: DrizzleClient) => Promise<T>) => Effect.Effect<T, Error>
}

export class DrizzleNodePgClient extends Context.Service<
  DrizzleNodePgClient,
  DrizzleNodePgClientImpl
>()('packages/db-drizzlepg/DrizzleNodePgClient', {
  make: Effect.gen(function* () {
    const { pool } = yield* createNodePgPool({
      connectionString: yield* Config.redacted('DB_CONNECTION_STRING'),
      // TODO: need to add additional connection config
    })

    const db = drizzle({
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
}) {
  static readonly layer = Layer.effect(this)(this.make)
}
