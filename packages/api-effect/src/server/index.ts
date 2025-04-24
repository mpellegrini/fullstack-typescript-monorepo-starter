import { HttpApiBuilder, HttpApiScalar, HttpServer } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'
import { createServer } from 'node:http'

import { taskGroupLive } from '../impl/index.js'
import { PlatformApi } from '../platform-api.js'

const mainApiLive = HttpApiBuilder.api(PlatformApi).pipe(Layer.provide([taskGroupLive]))

const HttpLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiScalar.layer({ scalar: { layout: 'modern', theme: 'kepler' } })),
  Layer.provide(mainApiLive),
  HttpServer.withLogAddress,
)

NodeRuntime.runMain(
  Layer.launch(HttpLive.pipe(Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })))),
)

// const docLayer = HttpApiScalar.layer({
//   path: '/api/docs',
//   scalar: { layout: 'modern', theme: 'kepler' },
// }).pipe(Layer.provide(mainApiLive))
//
// export const webHandler = HttpApiBuilder.toWebHandler(
//   Layer.mergeAll(mainApiLive, docLayer, HttpServer.layerContext),
// )
