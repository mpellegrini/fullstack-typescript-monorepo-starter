import * as HttpLayerRouter from '@effect/platform/HttpLayerRouter'
import * as Layer from 'effect/Layer'

import { api } from './api.js'
import { greetingsApiLive } from './greetings/api-implementation.js'

// Provide the implementation for the API
export const httpApiRoutesLive = HttpLayerRouter.addHttpApi(api, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(greetingsApiLive))
