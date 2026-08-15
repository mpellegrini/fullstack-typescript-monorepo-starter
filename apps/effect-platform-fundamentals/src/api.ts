import * as HttpApi from 'effect/unstable/httpapi/HttpApi'

import { greetingsApi } from './greetings/api-definition.ts'

/**
 * After defining your groups, you can combine them into one HttpApi representing
 * your entire set of endpoints.
 */
export const api = HttpApi.make('api').add(greetingsApi)
