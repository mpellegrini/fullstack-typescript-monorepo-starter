import * as HttpApiBuilder from '@effect/platform/HttpApiBuilder'
import * as Layer from 'effect/Layer'

import { myApi } from './api-definition.js'
import { myApiGreetingsLive } from './api-implementation.js'

// Provide the implementation for the API
export const myApiLive = HttpApiBuilder.api(myApi).pipe(Layer.provide(myApiGreetingsLive))
