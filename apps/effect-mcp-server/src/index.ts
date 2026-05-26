import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as HttpRouter from 'effect/unstable/http/HttpRouter'
import * as HttpServerResponse from 'effect/unstable/http/HttpServerResponse'
import { createServer } from 'node:http'

import { ApiRouter, ApiScalarRouter, ApiSwaggerRouter } from './http-api.ts'

const HelloRouter = HttpRouter.add('GET', '/hello', (_request) =>
  Effect.succeed(HttpServerResponse.text('Hello, World!')),
)

const AllRouters = Layer.mergeAll(ApiRouter, ApiScalarRouter, ApiSwaggerRouter, HelloRouter)

// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpRouter.serve(AllRouters).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

// Launch the server
Layer.launch(ServerLive).pipe(NodeRuntime.runMain)
