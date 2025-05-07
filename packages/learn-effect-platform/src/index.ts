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

class User extends Schema.Class<User>('User')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class CurrentUser extends Context.Tag('CurrentUser')<CurrentUser, User>() {}

export class Authentication extends HttpApiMiddleware.Tag<Authentication>()('Authentication', {
  failure: Unauthorized,
  provides: CurrentUser,
  security: {
    apiKey: HttpApiSecurity.apiKey({ in: 'header', key: 'X-API-Key' }).pipe(
      HttpApiSecurity.annotateContext(
        OpenApi.annotations({
          description: 'My Security Description',
        }),
      ),
    ),
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
  .middleware(Authentication)
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
        const currentUser = yield* CurrentUser
        yield* Effect.logInfo('TasksRepository.findById', currentUser)
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
        const currentUser = yield* CurrentUser
        const repository = yield* TasksRepository
        yield* Effect.logInfo('TasksService.findById', currentUser)
        return yield* repository.findById(id)
      })

    return {
      findById,
    } as const
  }),
}) {}

const AuthenticationLive = Layer.succeed(
  Authentication,
  Authentication.of({
    apiKey: (apiKey) =>
      Effect.gen(function* () {
        yield* Effect.logInfo('Authentication Middleware - checking api key')

        if (Redacted.value(apiKey) !== 'sk_opensaysme') {
          return yield* Effect.fail(new Unauthorized())
        }

        return User.make({
          id: 1000,
          name: `Authenticated with ${Redacted.value(apiKey)}`,
        })
      }),
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
  Layer.provide(AuthenticationLive),
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
