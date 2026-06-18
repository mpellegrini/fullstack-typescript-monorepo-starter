import { HttpApiBuilder, HttpApiScalar, HttpMiddleware, HttpServer } from '@effect/platform'
import { NodeHttpServer } from '@effect/platform-node'
import { Config, Layer } from 'effect'
import { createServer } from 'node:http'

import { ApiLive } from '@packages/api-impl'

const ServerLive = Layer.unwrapEffect(
  Config.integer('PORT')
    .pipe(Config.withDefault(3000))
    .pipe(Config.map((port) => NodeHttpServer.layer(createServer, { port }))),
)

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiScalar.layer({ scalar: { layout: 'modern', theme: 'kepler' } })),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(ServerLive),
)
