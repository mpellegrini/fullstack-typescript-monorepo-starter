import * as Layer from 'effect/Layer'
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder'

import { api } from './api.js'
import { greetingsApiLive } from './greetings/api-implementation.js'

/**
 * Represents the live HTTP API routes for the application.
 *
 * Note: HttpApiBuilder.layer() takes the Api definition plus the group implementations
 *       provided to it and registers every route with the shared HttpRouter service.
 *       In v3 this was split between HttpApiBuilder.api() and HttpLayerRouter.addHttpApi();
 *       v4 consolidated both into this single layer.
 */
export const httpApiRoutesLive = HttpApiBuilder.layer(api, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(greetingsApiLive))
