import { HttpApiBuilder, HttpApiScalar, HttpServer } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'
import { createServer } from 'node:http'

import { Api } from '@packages/api'
import { taskGroupLive } from '@packages/api-impl'

const ApiLive = HttpApiBuilder.api(Api).pipe(Layer.provide(taskGroupLive))

const openApiDocLayer = HttpApiScalar.layer({
  path: '/api/docs',
  scalar: { layout: 'modern', theme: 'kepler' },
}).pipe(Layer.provide(ApiLive))

const HttpLive = HttpApiBuilder.serve().pipe(
  Layer.provide(ApiLive),
  Layer.provide(openApiDocLayer),
  HttpServer.withLogAddress,
)

NodeRuntime.runMain(
  Layer.launch(HttpLive.pipe(Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })))),
)
