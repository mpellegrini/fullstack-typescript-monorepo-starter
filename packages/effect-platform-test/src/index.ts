import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiMiddleware,
  HttpMiddleware,
} from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Context, Effect, Layer, Schema } from 'effect'
import { createServer } from 'node:http'

class User extends Schema.Class<User>('User')({
  name: Schema.String,
}) {}

class Me extends Context.Tag('Me')<Me, User>() {}

class AuthenticationMiddleware extends HttpApiMiddleware.Tag<AuthenticationMiddleware>()(
  'AuthenticationMiddleware',
  {
    provides: Me,
  },
) {}

export const AuthenticationMiddlewareLive = Layer.effect(
  AuthenticationMiddleware,
  // eslint-disable-next-line require-yield -- todo
  Effect.gen(function* () {
    return Effect.succeed(new User({ name: 'mike p' }))
  }),
)

const Api = HttpApi.make('api')
  .add(
    HttpApiGroup.make('greetings').add(
      HttpApiEndpoint.get('hello', '/hello').addSuccess(Schema.String),
    ),
  )
  .middleware(AuthenticationMiddleware)

const GreetingsLive = HttpApiBuilder.group(Api, 'greetings', (handlers) =>
  // eslint-disable-next-line require-yield -- todo
  Effect.gen(function* () {
    return handlers.handle('hello', () =>
      Effect.flatMap(Me, (me) => Effect.succeed(`hello ${me.name}`)),
    )
  }),
)
const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(GreetingsLive),
  Layer.provide(AuthenticationMiddlewareLive),
)

const Main = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(ApiLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

NodeRuntime.runMain(Layer.launch(Main))
