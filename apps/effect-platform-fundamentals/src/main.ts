import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import * as HttpRouter from 'effect/unstable/http/HttpRouter'
import * as HttpServerResponse from 'effect/unstable/http/HttpServerResponse'
import * as HttpApi from 'effect/unstable/httpapi/HttpApi'
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder'
import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint'
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup'
import * as Rpc from 'effect/unstable/rpc/Rpc'
import * as RpcGroup from 'effect/unstable/rpc/RpcGroup'
import * as RpcSerialization from 'effect/unstable/rpc/RpcSerialization'
import * as RpcServer from 'effect/unstable/rpc/RpcServer'
import { createServer } from 'node:http'

class User extends Schema.Class<User>('User')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class UsersApi extends HttpApiGroup.make('users')
  .add(HttpApiEndpoint.get('me', '/me', { success: User }))
  .prefix('/users') {}

class MyApi extends HttpApi.make('api').add(UsersApi) {}

const UsersLive = HttpApiBuilder.group(MyApi, 'users', (handlers) =>
  handlers.handle('me', (_) => Effect.succeed(new User({ id: 1, name: 'John Doe' }))),
)

export class UserRpcContract extends RpcGroup.make(
  Rpc.make('GetUser', {
    success: User,
  }),
) {}

export const UsersRpcHandlers = UserRpcContract.toLayer(
  // eslint-disable-next-line require-yield -- todo
  Effect.gen(function* () {
    return {
      GetUser: () => Effect.succeed(new User({ id: 1, name: 'RPC User' })),
    }
  }),
)

// v4 has a single HttpRouter service, so the protocol layer no longer takes a routerTag.
const RpcRoutes = RpcServer.layer(UserRpcContract).pipe(
  Layer.provide(
    RpcServer.layerProtocolWebsocket({
      path: '/rpc',
    }),
  ),
  Layer.provide(UsersRpcHandlers),
  Layer.provide(RpcSerialization.layerJson),
)

const HttpApiRoutes = HttpApiBuilder.layer(MyApi, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(UsersLive))

const SimpleRoute = HttpRouter.add('GET', '/health', HttpServerResponse.text('Simply fantastic!'))

const GoodbyeRoute = HttpRouter.use(
  Effect.fnUntraced(function* (router) {
    // The `router` parameter is the `HttpRouter` service
    yield* router.add('GET', '/goodbye', HttpServerResponse.text('Goodbye, World!'))
    yield* router.add('GET', '/goodbye2', HttpServerResponse.text('Goodbye, World 2!'))
  }),
)

const HttpRoutes = Layer.mergeAll(RpcRoutes, HttpApiRoutes, SimpleRoute, GoodbyeRoute)

export const HttpLayer = HttpRouter.serve(HttpRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

// eslint-disable-next-line unicorn/no-top-level-side-effects -- demo purposes only
HttpLayer.pipe(Layer.launch, NodeRuntime.runMain)
