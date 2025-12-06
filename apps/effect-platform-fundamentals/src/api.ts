import * as HttpApi from '@effect/platform/HttpApi'

import { greetingsApi } from './greetings/api-definition.js'

/**
 * After defining your groups, you can combine them into one HttpApi representing
 * your entire set of endpoints.
 */
export const api = HttpApi.make('api').add(greetingsApi)
