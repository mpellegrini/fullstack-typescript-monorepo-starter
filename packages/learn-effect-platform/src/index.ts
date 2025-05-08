/**
 * You can only access "request level" context after a service is constructed.
 * That is generally the only time putting "requirements" into service methods is ok.
 */

import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiMiddleware,
  HttpApiScalar,
  HttpApiSchema,
  HttpApiSecurity,
  HttpMiddleware,
  HttpServer,
  OpenApi,
} from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Unauthorized } from '@effect/platform/HttpApiError'
import { Context, Effect, Layer, Redacted, Schema } from 'effect'
import { createServer } from 'node:http'

class Caller extends Schema.Class<Caller>('Caller')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class CallerContext extends Context.Tag('CurrentUser')<CallerContext, Caller>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()('Authorization', {
  failure: Unauthorized,
  provides: CallerContext,
  security: {
    apiKey: HttpApiSecurity.apiKey({ in: 'header', key: 'X-API-Key' }),
  },
}) {}

export class Task extends Schema.Class<Task>('Task')({
  id: Schema.Number,
  done: Schema.Boolean,
  name: Schema.NonEmptyTrimmedString,
}) {}

class TasksApi extends HttpApiGroup.make('tasks')
  .add(
    HttpApiEndpoint.get(
      'findById',
    )`/${HttpApiSchema.param('id', Schema.NumberFromString)}`.addSuccess(Task),
  )
  .middleware(Authorization)
  .prefix('/tasks')
  .annotateContext(
    OpenApi.annotations({
      description: 'API for managing tasks',
      title: 'Tasks',
    }),
  ) {}

class MyApi extends HttpApi.make('api').add(TasksApi) {}

// ------------------------------------------------
// implementation
// ------------------------------------------------

export class TasksRepository extends Effect.Service<TasksRepository>()('TasksRepository', {
  effect: Effect.gen(function* () {
    yield* Effect.logInfo('Constructed Tasks Repository')
    const findById = //
      Effect.fn('TasksRepository.findById')(function* (id: number) {
        const callerContext = yield* CallerContext
        yield* Effect.logInfo('TasksRepository.findById', callerContext)
        return Task.make({ id, done: false, name: 'Learn Effect' })
      })
    return {
      findById,
    }
  }),
}) {}

export class TasksService extends Effect.Service<TasksService>()('TasksService', {
  effect: Effect.gen(function* () {
    yield* Effect.logInfo('Constructed Tasks Service')
    const findById = //
      Effect.fn('TasksService.findById')(function* (id: number) {
        const callerContext = yield* CallerContext
        const repository = yield* TasksRepository
        yield* Effect.logInfo('TasksService.findById', callerContext)
        return yield* repository.findById(id)
      })

    return {
      findById,
    } as const
  }),
}) {}

const AuthorizationLive = Layer.effect(
  Authorization,
  // eslint-disable-next-line require-yield -- todo
  Effect.gen(function* () {
    return Authorization.of({
      apiKey: Effect.fn(function* (apiKey) {
        yield* Effect.logInfo('Authentication Middleware - checking api key')

        return Redacted.value(apiKey) === 'sk_opensaysme'
          ? Caller.make({ id: 1000, name: `Authenticated with ${Redacted.value(apiKey)}` })
          : yield* new Unauthorized()
      }),
    })
  }),
)

const TasksLive = HttpApiBuilder.group(MyApi, 'tasks', (handlers) =>
  handlers //
    .handle('findById', ({ path }) =>
      //
      Effect.gen(function* () {
        const service = yield* TasksService
        return yield* service.findById(path.id)
      }),
    ),
).pipe(
  Layer.provide(AuthorizationLive),
  Layer.provide([TasksService.Default, TasksRepository.Default]),
)

const ApiLive = HttpApiBuilder.api(MyApi)
  //
  .pipe(Layer.provide(TasksLive))

// ------------------------------------------------
// server
// ------------------------------------------------

HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiScalar.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ApiLive),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.launch,
  NodeRuntime.runMain(),
)
