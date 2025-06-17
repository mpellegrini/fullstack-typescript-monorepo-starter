import { Config, Effect } from 'effect'

export class EnvVars extends Effect.Service<EnvVars>()('EnvVars', {
  accessors: true,
  effect: Effect.gen(function* () {
    return {
      CI: yield* Config.withDefault(Config.boolean('CI'), false),
      DB_CONNECTION_STRING: yield* Config.redacted('DB_CONNECTION_STRING'),
      DB_IDLE_TIMEOUT_MILLIS: yield* Config.withDefault(
        Config.integer('DB_IDLE_TIMEOUT_MILLIS'),
        10_000,
      ),
      DB_LOGGING_ENABLED: yield* Config.withDefault(Config.boolean('DB_LOGGING_ENABLED'), false),
      DB_MAX_CONNECTIONS: yield* Config.integer('DB_MAX_CONNECTIONS').pipe(Config.withDefault(10)),
      ENV: yield* Config.withDefault(
        Config.literal('production', 'development', 'test')('ENV'),
        'development',
      ),
      PORT: yield* Config.withDefault(Config.integer(), 3000),
    } as const
  }),
}) {}
