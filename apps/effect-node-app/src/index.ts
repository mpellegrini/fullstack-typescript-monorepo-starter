import { HttpApiBuilder, HttpApiScalar, HttpMiddleware, HttpServer } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'
import { createServer } from 'node:http'

import { ApiLive } from '@packages/api-impl'

HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(
    HttpApiScalar.layer({
      path: '/api/docs',
      scalar: { layout: 'modern', theme: 'kepler' },
    }),
  ),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.launch,
  NodeRuntime.runMain,
)
