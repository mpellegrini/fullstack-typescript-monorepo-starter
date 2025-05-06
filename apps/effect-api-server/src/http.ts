import {
  HttpApiBuilder,
  HttpApiScalar,
  HttpMiddleware,
  HttpServer,
  PlatformConfigProvider,
} from '@effect/platform'
import { NodeFileSystem, NodeHttpServer } from '@effect/platform-node'
import { Effect, Layer } from 'effect'
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

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.merge(Layer.effectDiscard(Database.Database.use((db) => db.setupConnectionListeners))),
  Layer.provide(DatabaseLive),
  Layer.provide(HttpApiScalar.layer({ scalar: { layout: 'modern', theme: 'kepler' } })),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  Layer.provide(EnvProviderLayer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)
