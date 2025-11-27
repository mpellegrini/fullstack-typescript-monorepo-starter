import * as HttpApi from '@effect/platform/HttpApi'
import * as HttpApiEndpoint from '@effect/platform/HttpApiEndpoint'
import * as HttpApiGroup from '@effect/platform/HttpApiGroup'
import * as Schema from 'effect/Schema'

/**
 * An HttpApiEndpoint represents a single endpoint in your API.
 * Each endpoint is defined with a:
 *  - name
 *  - path-
 *  - HTTP method
 *  - optional schemas for requests and responses
 */
const helloWorldEndpoint = HttpApiEndpoint.get('hello-world')`/`.addSuccess(Schema.String)

/**
 * You can group related endpoints under a single entity by using HttpApiGroup.make().
 * This can help organize your code and provide a clearer structure for your API.
 */
const greetingsGroup = HttpApiGroup.make('greetings').add(helloWorldEndpoint)

/**
 * After defining your groups, you can combine them into one HttpApi representing
 * your entire set of endpoints.
 */
export const myApi = HttpApi.make('MyApi').add(greetingsGroup)
