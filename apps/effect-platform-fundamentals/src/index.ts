import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as HttpApiScalar from '@effect/platform/HttpApiScalar'
import * as HttpLayerRouter from '@effect/platform/HttpLayerRouter'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { createServer } from 'node:http'

import { httpApiRoutesLive } from './api-live.js'
import { api } from './api.js'

const docsRouteLive = HttpApiScalar.layerHttpLayerRouter({
  api: api,
  path: '/docs',
})

const allRoutes = Layer.mergeAll(httpApiRoutesLive, docsRouteLive)

/**
 * Serves the provided application layer as an HTTP server.
 */
export const httpLayer = HttpLayerRouter.serve(allRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

Layer.launch(httpLayer).pipe(
  //
  Effect.tapErrorCause(Effect.logFatal),
  NodeRuntime.runMain,
)

/**
 *  This utility builds an HttpApp from an HttpApi instance and uses an
 *  HttpServer to handle requests. Middleware can be added to customize or
 *  enhance the server's behavior.
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
