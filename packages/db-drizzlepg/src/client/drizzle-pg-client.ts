import type * as Pg from 'pg'

import * as PgClient from '@effect/sql-pg/PgClient'
import * as PgDrizzle from 'drizzle-orm/effect-postgres'
import * as Config from 'effect/Config'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { types as pgTypes } from 'pg'

/**
 * OIDs whose raw text values are handed straight through to Drizzle, which owns
 * the mapping to JavaScript values: the date/time types (and their array
 * variants), plus `numeric[]` so numeric precision survives instead of being
 * coerced to a lossy JavaScript number.
 */
const rawTextOids: ReadonlySet<number> = new Set([
  1082, // date
  1114, // timestamp
  1115, // timestamp[]
  1182, // date[]
  1184, // timestamptz
  1185, // timestamptz[]
  1186, // interval
  1187, // interval[]
  1231, // numeric[]
])

const customTypes: Pg.CustomTypesConfig = {
  getTypeParser: (oid, format) => {
    if (rawTextOids.has(oid)) {
      return (value: string): string => value
    }

    const defaultTypeParser: unknown = pgTypes.getTypeParser(oid, format)
    return defaultTypeParser
  },
}

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
  types: Config.succeed(customTypes),
  url: Config.redacted('DB_CONNECTION_STRING'),
})

export class DrizzlePgClient extends Context.Service<DrizzlePgClient, DrizzlePgClientImpl>()(
  '@packages/db-drizzlepg/DrizzlePgClient',
  {
    make: Effect.gen(function* () {
      const db = yield* PgDrizzle.makeWithDefaults()

      return { db } satisfies DrizzlePgClientImpl
    }),
  },
) {
  static readonly layer = Layer.effect(this)(this.make).pipe(Layer.provide(PgClientLive))
}
