import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as HttpRouter from 'effect/unstable/http/HttpRouter'
import * as HttpApiScalar from 'effect/unstable/httpapi/HttpApiScalar'
import { createServer } from 'node:http'

import { httpApiRoutesLive } from './api-live.ts'
import { api } from './api.ts'

const docsRouteLive = HttpApiScalar.layerCdn(api, {
  path: '/docs',
})

const allRoutes = Layer.mergeAll(httpApiRoutesLive, docsRouteLive)

/**
 * Serves the provided application layer as an HTTP server.
 *
 * NodeHttpServer.layer() supplies the HttpServer along with the platform services
 * (NodeServices, HttpPlatform and Etag.Generator) that HttpApiBuilder.layer requires,
 * so no additional services layer needs to be provided here.
 */
export const httpLayer = HttpRouter.serve(allRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

// eslint-disable-next-line unicorn/no-top-level-side-effects -- demo purposes only
Layer.launch(httpLayer).pipe(
  //
  Effect.tapCause(Effect.logFatal),
  NodeRuntime.runMain,
)

/**
 * Note: v4 has a single way to serve an HttpApi. The v3 HttpApiBuilder.serve() helper
 *       (and the HttpApiBuilder vs HttpLayerRouter split it belonged to) was removed:
 *       build the routes with HttpApiBuilder.layer() and serve them with HttpRouter.serve().
 */
// export const serverLive = HttpApiBuilder.serve().pipe(
//   Layer.provide(HttpApiScalar.layer()),
//   Layer.provide(apiLive),
//   Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
// )

// Launch the server
// Layer.launch(serverLive).pipe(
//   //
//   Effect.tapErrorCause(Effect.logFatal),
//   NodeRuntime.runMain,
// )
