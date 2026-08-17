import * as PgClient from '@effect/sql-pg/PgClient'
import * as PgDrizzle from 'drizzle-orm/effect-postgres'
import * as Config from 'effect/Config'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { toTaggedErrorOrThrow } from './database-errors.ts'

type DrizzleClient = PgDrizzle.EffectPgDatabase & {
  $client: PgClient.PgClient
}

interface DrizzleNodePgClientImpl {
  readonly db: DrizzleClient
  readonly use: <T>(fn: (client: DrizzleClient) => Promise<T>) => Effect.Effect<T, Error>
}

const PgClientLive = PgClient.layerConfig({
  applicationName: Config.succeed('node-postgres-pool'),
  connectTimeout: Config.succeed('0 millis'),
  idleTimeout: Config.succeed('10 seconds'),
  maxConnections: Config.succeed(10),
  minConnections: Config.succeed(0),
  url: Config.redacted('DB_CONNECTION_STRING'),
})

export class DrizzleNodePgClient extends Context.Service<
  DrizzleNodePgClient,
  DrizzleNodePgClientImpl
>()('packages/db-drizzlepg/DrizzleNodePgClient', {
  make: Effect.gen(function* () {
    const db = yield* PgDrizzle.makeWithDefaults()

    const use = Effect.fn(<T>(fn: (client: DrizzleClient) => Promise<T>) =>
      Effect.tryPromise({
        catch: (cause) => toTaggedErrorOrThrow(cause),
        try: () => fn(db),
      }),
    )

    return { db, use } satisfies DrizzleNodePgClientImpl
  }),
}) {
  static readonly layer = Layer.effect(this)(this.make).pipe(Layer.provide(PgClientLive))
}
