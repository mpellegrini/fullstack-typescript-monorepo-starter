import { HttpApiEndpoint, HttpServer, HttpServerResponse } from '@effect/platform'
import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as HttpApi from '@effect/platform/HttpApi'
import * as HttpApiBuilder from '@effect/platform/HttpApiBuilder'
import * as HttpApiGroup from '@effect/platform/HttpApiGroup'
import * as HttpLayerRouter from '@effect/platform/HttpLayerRouter'
import { Rpc, RpcGroup, RpcSerialization, RpcServer } from '@effect/rpc'
import { Effect, Layer, Schema } from 'effect'
import { createServer } from 'node:http'

class User extends Schema.Class<User>('User')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class UsersApi extends HttpApiGroup.make('users')
  .add(HttpApiEndpoint.get('me', '/me').addSuccess(User))
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

const RpcRoutes = RpcServer.layer(UserRpcContract).pipe(
  Layer.provide(
    RpcServer.layerProtocolWebsocket({
      path: '/rpc',
      routerTag: HttpApiBuilder.Router,
    }),
  ),
  Layer.provide(UsersRpcHandlers),
  Layer.provide(RpcSerialization.layerJson),
)

const HttpApiRoutes = HttpLayerRouter.addHttpApi(MyApi, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(UsersLive), Layer.provide(HttpServer.layerContext))

const SimpleRoute = HttpLayerRouter.add(
  'GET',
  '/health',
  HttpServerResponse.text('Simply fantastic!'),
)

const GoodbyeRoute = HttpLayerRouter.use(
  Effect.fnUntraced(function* (router) {
    // The `router` parameter is the `HttpRouter` service
    yield* router.add('GET', '/goodbye', HttpServerResponse.text('Goodbye, World!'))
    yield* router.add('GET', '/goodbye2', HttpServerResponse.text('Goodbye, World 2!'))
  }),
)

const HttpLayerRoutes = Layer.mergeAll(RpcRoutes, HttpApiRoutes, SimpleRoute, GoodbyeRoute)

export const HttpLayer = HttpLayerRouter.serve(HttpLayerRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

HttpLayer.pipe(Layer.launch, NodeRuntime.runMain)
