import { Config, Effect } from 'effect'

export class EnvVars extends Effect.Service<EnvVars>()('EnvVars', {
  accessors: true,
  effect: Effect.gen(function* () {
    return {
      CI: yield* Config.boolean('CI').pipe(Config.withDefault(false)),
      NODE_ENV: yield* Config.literal(
        'production',
        'development',
        'test',
      )('NODE_ENV').pipe(Config.withDefault('development')),
      PORT: yield* Config.integer().pipe(Config.withDefault(3000)),
    } as const
  }),
}) {}
