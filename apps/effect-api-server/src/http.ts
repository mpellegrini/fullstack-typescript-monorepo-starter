import { NodeHttpServer } from '@effect/platform-node'
import { Config, Layer } from 'effect'
import { HttpRouter } from 'effect/http'
import { HttpApiScalar } from 'effect/http-api'
import * as HttpServerResponse from 'effect/http/HttpServerResponse'
import { createServer } from 'node:http'

import { Api } from '@packages/api'
import { ApiLive } from '@packages/api-impl'

const ServerLive = Config.Int('PORT').pipe(
  Config.withDefault(3000),
  Config.map((port) => NodeHttpServer.layer(createServer, { port })),
  Layer.unwrap,
)

const DocsLive = HttpApiScalar.layer(Api, {
  path: '/docs',
  scalar: { layout: 'modern', theme: 'kepler' },
})

const HealthRoute = HttpRouter.add('GET', '/health', HttpServerResponse.text('ok'))

const allRoutes = Layer.mergeAll(HealthRoute, ApiLive, DocsLive, HttpRouter.cors())

/**
Serves the provided application layer as an HTTP server.

NodeHttpServer.layer() supplies the HttpServer along with the platform services
(NodeServices, HttpPlatform and Etag.Generator) that HttpApiBuilder.layer requires,
so no additional services layer needs to be provided here.
*/
export const HttpLive = HttpRouter.serve(allRoutes).pipe(Layer.provide(ServerLive))
