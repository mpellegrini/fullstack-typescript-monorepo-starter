import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
  HttpApiSchema,
  OpenApi,
} from '@effect/platform'
import { Schema } from 'effect'
import status from 'http-status'

import * as CustomHttpApiError from '../custom-httpapi-error.js'
import { TodoId } from '../entity-ids.js'

export class Task extends Schema.Class<Task>('Task')({
  id: TodoId,
  done: Schema.Boolean,
  name: Schema.NonEmptyTrimmedString,
}) {}

export const UuidParamSchema = HttpApiSchema.param('id', Schema.UUID)

export class ApiGroup extends HttpApiGroup.make('tasks') //
  .add(
    HttpApiEndpoint.get('getTaskById')`/${UuidParamSchema}`
      .addSuccess(Task, { status: status.OK })
      .addError(CustomHttpApiError.BadRequest)
      .addError(HttpApiError.HttpApiDecodeError)
      .addError(CustomHttpApiError.NotFound),
  )
  .prefix('/tasks')
  .annotateContext(
    OpenApi.annotations({
      description: 'API for managing tasks',
      title: 'Tasks',
    }),
  ) {}
