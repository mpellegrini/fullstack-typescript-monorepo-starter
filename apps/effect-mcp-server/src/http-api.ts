import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import * as HttpApi from 'effect/unstable/httpapi/HttpApi'
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder'
import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint'
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup'
import * as HttpApiScalar from 'effect/unstable/httpapi/HttpApiScalar'
import * as HttpApiSwagger from 'effect/unstable/httpapi/HttpApiSwagger'

// Definition
const Api = HttpApi.make('MyApi').add(
  // Define the API group
  HttpApiGroup.make('Greetings').add(
    // Define the endpoint
    HttpApiEndpoint.get('hello', '/hello-api', {
      // Define the success schema
      success: Schema.String,
    }),
  ),
)

// Implementation
const GroupLive = HttpApiBuilder.group(
  Api,
  'Greetings', // The name of the group to handle
  (handlers) =>
    handlers.handle(
      'hello', // The name of the endpoint to handle
      () => Effect.succeed('Hello, World!'), // The handler function
    ),
)

export const ApiScalarRouter = HttpApiScalar.layer(Api, {
  path: '/docs/scalar',
  scalar: {
    theme: 'deepSpace',
  },
})
export const ApiSwaggerRouter = HttpApiSwagger.layer(Api, {
  path: '/docs/swagger',
})

export const ApiRouter = HttpApiBuilder.layer(Api, { openapiPath: '/openapi.json' }).pipe(
  Layer.provide(GroupLive),
)
