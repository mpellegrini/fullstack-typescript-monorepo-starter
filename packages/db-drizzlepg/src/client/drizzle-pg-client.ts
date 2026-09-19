import * as PgClient from '@effect/sql-pg/PgClient'
import { EffectCache } from 'drizzle-orm/cache/core/cache-effect'
import * as PgDrizzle from 'drizzle-orm/effect-postgres'
import * as Config from 'effect/Config'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { QueryLoggerLive } from '../query-logger.ts'

export type DrizzleClient = PgDrizzle.EffectPgDatabase & {
  $client: PgClient.PgClient
}

interface DrizzlePgClientImpl {
  readonly db: DrizzleClient
}

const PgClientLive = PgClient.layerConfig({
  applicationName: Config.succeed('effect-sql-pg-pool'),
  connectTimeout: Config.succeed('5 seconds'),
  idleTimeout: Config.succeed('10 seconds'),
  maxConnections: Config.succeed(10),
  minConnections: Config.succeed(0),
  url: Config.Redacted('DB_CONNECTION_STRING'),
})

export class DrizzlePgClient extends Context.Service<DrizzlePgClient, DrizzlePgClientImpl>()(
  '@packages/db-drizzlepg/DrizzlePgClient',
  {
    make: Effect.gen(function* () {
      const isQueryLoggingEnabled = yield* Config.Boolean('DB_LOGGING_ENABLED').pipe(
        Config.withDefault(false),
      )

      const db = yield* PgDrizzle.make().pipe(
        Effect.provide(
          Layer.mergeAll(
            isQueryLoggingEnabled ? QueryLoggerLive : PgDrizzle.EffectLogger.Default,
            EffectCache.Default,
          ),
        ),
      )

      return { db } satisfies DrizzlePgClientImpl
    }),
  },
) {
  static readonly layer = Layer.effect(this)(this.make).pipe(Layer.provide(PgClientLive))
}
