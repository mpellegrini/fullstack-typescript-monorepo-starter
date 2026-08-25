/**
 * You can only access "request level" context after a service is constructed.
 * That is generally the only time putting "requirements" into service methods is ok.
 */

import type { PutItemCommandInput } from '@aws-sdk/client-dynamodb'

import { DynamoDB } from '@effect-aws/client-dynamodb'
import * as NodeSdk from '@effect/opentelemetry/NodeSdk'
import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import * as Schema from 'effect/Schema'
import * as HttpEffect from 'effect/unstable/http/HttpEffect'
import * as HttpRouter from 'effect/unstable/http/HttpRouter'
import * as HttpServerResponse from 'effect/unstable/http/HttpServerResponse'
import * as HttpApi from 'effect/unstable/httpapi/HttpApi'
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder'
import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint'
import * as HttpApiError from 'effect/unstable/httpapi/HttpApiError'
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup'
import * as HttpApiMiddleware from 'effect/unstable/httpapi/HttpApiMiddleware'
import * as HttpApiScalar from 'effect/unstable/httpapi/HttpApiScalar'
import * as HttpApiSecurity from 'effect/unstable/httpapi/HttpApiSecurity'
import * as OpenApi from 'effect/unstable/httpapi/OpenApi'
import { createServer } from 'node:http'

class Caller extends Schema.Class<Caller>('Caller')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class CallerContext extends Context.Service<CallerContext, Caller>()('CurrentUser') {}

class Authorization extends HttpApiMiddleware.Service<
  Authorization,
  {
    provides: CallerContext
  }
>()('Authorization', {
  error: HttpApiError.Unauthorized,
  security: {
    apiKey: HttpApiSecurity.apiKey({ in: 'header', key: 'X-API-Key' }),
  },
}) {}

class PoweredByMiddleware extends HttpApiMiddleware.Service<PoweredByMiddleware>()(
  'PoweredByMiddleware',
) {}

class Task extends Schema.Class<Task>('Task')({
  id: Schema.Number,
  done: Schema.Boolean,
  name: Schema.String.check(Schema.isNonEmpty(), Schema.isTrimmed()),
}) {}

class TasksApi extends HttpApiGroup.make('tasks')
  .add(
    // Path parameters are coerced from their string form, so `Schema.Number`
    // decodes here without a dedicated `NumberFromString` schema.
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: Schema.Number },
      success: Task,
    }),
  )
  .middleware(Authorization)
  .middleware(PoweredByMiddleware)
  .prefix('/tasks')
  .annotateMerge(
    OpenApi.annotations({
      description: 'API for managing tasks',
      title: 'Tasks',
    }),
  ) {}

class MyApi extends HttpApi.make('api').add(TasksApi) {}

// ------------------------------------------------
// implementation
// ------------------------------------------------

interface TasksRepositoryImpl {
  readonly findById: (id: number) => Effect.Effect<Task, never, CallerContext>
}

class TasksRepository extends Context.Service<TasksRepository, TasksRepositoryImpl>()(
  'TasksRepository',
  {
    make: Effect.gen(function* () {
      yield* Effect.logInfo('Constructed Tasks Repository')
      const db = yield* DynamoDB
      const findById = //
        Effect.fn('TasksRepository.findById')(function* (id: number) {
          const args: PutItemCommandInput = {
            Item: { testAttr: { S: 'test' } },
            TableName: 'session_store',
          }
          const ddbResult = yield* db.putItem(args).pipe(
            Effect.tapError((error) => Effect.logError(error.message)),
            Effect.catch((_) => Effect.succeed({})),
          )

          yield* Effect.logInfo(ddbResult)

          const callerContext = yield* CallerContext
          yield* Effect.logInfo('TasksRepository.findById', callerContext)
          return Task.make({ id, done: false, name: 'Learn Effect' })
        })
      return {
        findById,
      } satisfies TasksRepositoryImpl
    }),
  },
) {
  static readonly layer = Layer.effect(this)(this.make)
}

interface TasksServiceImpl {
  readonly findById: (id: number) => Effect.Effect<Task, never, CallerContext>
}

class TasksService extends Context.Service<TasksService, TasksServiceImpl>()('TasksService', {
  make: Effect.gen(function* () {
    yield* Effect.logInfo('Constructed Tasks Service')
    const repository = yield* TasksRepository
    const findById = //
      Effect.fn('TasksService.findById')(function* (id: number) {
        const callerContext = yield* CallerContext
        yield* Effect.logInfo('TasksService.findById', callerContext)
        return yield* repository.findById(id)
      })

    return {
      findById,
    } satisfies TasksServiceImpl
  }),
}) {
  static readonly layer = Layer.effect(this)(this.make)
}

/**
 * Middleware wraps the endpoint's response effect: the security handler receives
 * the decoded credential and provides `CallerContext` to everything downstream.
 */
const AuthorizationLive = Layer.succeed(Authorization)(
  Authorization.of({
    apiKey: Effect.fn(function* (httpEffect, { credential }) {
      yield* Effect.logInfo('Authentication Middleware - checking api key')

      if (Redacted.value(credential) !== 'sk_opensaysme') {
        return yield* new HttpApiError.Unauthorized()
      }

      return yield* Effect.provideService(
        httpEffect,
        CallerContext,
        Caller.make({ id: 1000, name: `Authenticated with ${Redacted.value(credential)}` }),
      )
    }),
  }),
)

/**
 * A pre-response handler runs once the response is ready, so the header is set on
 * every response the endpoint produces, including the ones raised by other middleware.
 */
const PoweredByMiddlewareLive = Layer.succeed(PoweredByMiddleware)((httpEffect) =>
  Effect.andThen(
    HttpEffect.appendPreResponseHandler((_req, res) =>
      Effect.succeed(HttpServerResponse.setHeader(res, 'X-Powered-By', 'effect')),
    ),
    httpEffect,
  ),
)

const TasksLive = HttpApiBuilder.group(
  MyApi,
  'tasks',
  Effect.fn(function* (handlers) {
    // Construction-time dependencies are resolved here, leaving `CallerContext`
    // as the only requirement the handlers carry into each request.
    const service = yield* TasksService

    return handlers //
      .handle('findById', ({ params }) => service.findById(params.id))
  }),
).pipe(
  Layer.provide(AuthorizationLive),
  Layer.provide(PoweredByMiddlewareLive),
  Layer.provide(TasksService.layer),
  Layer.provide(TasksRepository.layer),
  Layer.provide(
    DynamoDB.layer({
      credentials: {
        accessKeyId: 'fakeAccessKeyId',
        secretAccessKey: 'fakeSecretAccessKey',
      },
      endpoint: 'http://localhost:8000',
      region: 'local',
    }),
  ),
)

// ------------------------------------------------
// server
// ------------------------------------------------

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: {
    serviceName: 'learn-effect-platform',
  },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}))

const ApiRoutes = HttpApiBuilder.layer(MyApi, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(TasksLive))

const DocsRoute = HttpApiScalar.layer(MyApi, { path: '/docs' })

const AllRoutes = Layer.mergeAll(ApiRoutes, DocsRoute, HttpRouter.cors())

/**
 * `HttpRouter.serve` installs the request logger and logs the listen address,
 * so `HttpMiddleware.logger` and `HttpServer.withLogAddress` are not wired in here.
 */
HttpRouter.serve(AllRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.provide(NodeSdkLive),
  Layer.launch,
  NodeRuntime.runMain,
)
