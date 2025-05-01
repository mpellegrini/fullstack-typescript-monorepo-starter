import { Effect, Layer } from 'effect'

import { Database } from '@packages/db-drizzlepg/effect-client'

import { EnvVars } from './env-vars.js'

export const DatabaseLive = Layer.unwrapEffect(
  EnvVars.pipe(
    Effect.andThen((envVars) =>
      Database.layer({
        connectionString: envVars.DB_CONNECTION_STRING,
        loggingEnabled: envVars.DB_LOGGING_ENABLED,
        ssl: envVars.ENV === 'production',
      }),
    ),
  ),
).pipe(Layer.provide(EnvVars.Default))
