import {
  HttpApiBuilder,
  HttpApiScalar,
  HttpMiddleware,
  HttpServer,
  PlatformConfigProvider,
} from '@effect/platform'
import { NodeFileSystem, NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Duration, Effect, Layer, Schedule } from 'effect'
import { createServer } from 'node:http'

import { ApiLive } from '@packages/api-impl'
import { DatabaseLive } from '@packages/api-impl/services'
import { Database } from '@packages/db-drizzlepg/effect-client'

const EnvProviderLayer = Layer.unwrapEffect(
  PlatformConfigProvider.fromDotEnv('.env').pipe(
    Effect.andThen(Layer.setConfigProvider),
    Effect.provide(NodeFileSystem.layer),
  ),
)

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  // TODO: Ideally there should not require a dependency on @packages/db-drizzlepg
  //       and required setupConnection should not be a concern of the api server
  Layer.merge(Layer.effectDiscard(Database.Database.use((db) => db.setupConnectionListeners))),
  Layer.provide(DatabaseLive),
  Layer.provide(HttpApiScalar.layer({ scalar: { layout: 'modern', theme: 'kepler' } })),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ApiLive),
  Layer.provide(EnvProviderLayer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

Layer.launch(HttpLive).pipe(
  Effect.tapErrorCause(Effect.logError),
  Effect.retry({
    schedule: Schedule.exponential('1 second', 2).pipe(
      Schedule.modifyDelay(Duration.min('8 seconds')),
      Schedule.jittered,
      Schedule.repetitions,
      Schedule.modifyDelayEffect((count, delay) =>
        Effect.as(
          Effect.logError(
            `[Server crashed]: Retrying in ${Duration.format(delay)} (attempt #${count + 1})`,
          ),
          delay,
        ),
      ),
    ),
    while: (error) => error._tag === 'DatabaseConnectionLostError',
  }),
  NodeRuntime.runMain,
)
