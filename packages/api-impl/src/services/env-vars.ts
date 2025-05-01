import { Config, Effect } from 'effect'

export class EnvVars extends Effect.Service<EnvVars>()('EnvVars', {
  accessors: true,
  effect: Effect.gen(function* () {
    return {
      CI: yield* Config.boolean('CI').pipe(Config.withDefault(false)),
      DB_CONNECTION_STRING: yield* Config.redacted('DB_CONNECTION_STRING'),
      DB_IDLE_TIMEOUT_MILLIS: yield* Config.integer('DB_IDLE_TIMEOUT_MILLIS').pipe(
        Config.withDefault(10_000),
      ),
      DB_LOGGING_ENABLED: yield* Config.boolean('DB_LOGGING_ENABLED').pipe(
        Config.withDefault(false),
      ),
      DB_MAX_CONNECTIONS: yield* Config.integer('DB_MAX_CONNECTIONS').pipe(Config.withDefault(10)),
      ENV: yield* Config.literal(
        'production',
        'development',
        'test',
      )('ENV').pipe(Config.withDefault('development')),
      PORT: yield* Config.integer().pipe(Config.withDefault(3000)),
    } as const
  }),
}) {}
