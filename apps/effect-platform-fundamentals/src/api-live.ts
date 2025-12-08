import * as HttpLayerRouter from '@effect/platform/HttpLayerRouter'
import * as Layer from 'effect/Layer'

import { api } from './api.js'
import { greetingsApiLive } from './greetings/api-implementation.js'

/**
 * Represents the live HTTP API routes for the application.
 *
 * Note: This differs from the HttpApiBuilder.api, which produces an Api implementation.
 *       const MyApiLive = HttpApiBuilder.api(api).pipe(Layer.provide(greetingsApiLive))
 */
export const httpApiRoutesLive = HttpLayerRouter.addHttpApi(api, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(greetingsApiLive))
