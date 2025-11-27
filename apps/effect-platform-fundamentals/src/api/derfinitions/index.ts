import * as HttpApi from '@effect/platform/HttpApi'

import { greetingsGroup } from './grettings/index.js'

/**
 * After defining your groups, you can combine them into one HttpApi representing
 * your entire set of endpoints.
 */
export const myApi = HttpApi.make('MyApi').add(greetingsGroup)
