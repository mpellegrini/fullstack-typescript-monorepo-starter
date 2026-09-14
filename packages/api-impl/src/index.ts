import { Layer } from 'effect'
import { HttpApiBuilder } from 'effect/unstable/httpapi'

import { Api } from '@packages/api'

import { buildInfoGroupLive } from './build-info-live.ts'
import { taskGroupLive } from './tasks-live.ts'

/**
 * Represents the live HTTP API routes for the application.
 *
 * Note: HttpApiBuilder.layer() takes the Api definition plus the group implementations
 *       provided to it and registers every route with the shared HttpRouter service.
 *       In v3 this was split between HttpApiBuilder.api() and HttpLayerRouter.addHttpApi();
 *       v4 consolidated both into this single layer.
 */
export const ApiLive = HttpApiBuilder
  //
  .layer(Api, { openapiPath: '/openapi.json' })
  .pipe(Layer.provide(taskGroupLive), Layer.provide(buildInfoGroupLive))
