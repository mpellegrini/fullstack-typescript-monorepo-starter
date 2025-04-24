import { HttpApiBuilder, HttpApiScalar } from '@effect/platform'
import { Layer } from 'effect'

import { taskGroupLive } from '../impl/index.js'
import { PlatformApi } from '../platform-api.js'

export const platformApiLive = HttpApiBuilder.api(PlatformApi).pipe(Layer.provide(taskGroupLive))

export const openApiDocLayer = HttpApiScalar.layer({
  path: '/api/docs',
  scalar: { layout: 'modern', theme: 'kepler' },
}).pipe(Layer.provide(platformApiLive))

/*
export const webHandler = HttpApiBuilder.toWebHandler(
  Layer.mergeAll(platformApiLive, openApiDocLayer, HttpServer.layerContext),
)
*/
