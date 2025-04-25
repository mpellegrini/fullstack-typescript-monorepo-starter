import { HttpApiBuilder, HttpServer } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'
import { createServer } from 'node:http'

import { openApiDocLayer, platformApiLive } from '@packages/api-server'

const HttpLive = HttpApiBuilder.serve().pipe(
  Layer.provide(platformApiLive),
  Layer.provide(openApiDocLayer),
  HttpServer.withLogAddress,
)

NodeRuntime.runMain(
  Layer.launch(HttpLive.pipe(Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })))),
)
