import { HttpApiEndpoint, HttpApiError, HttpApiGroup, HttpApiSchema } from '@effect/platform'
import { Schema } from 'effect'

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
      .addSuccess(Task)
      .addError(CustomHttpApiError.BadRequest)
      .addError(HttpApiError.HttpApiDecodeError)
      .addError(CustomHttpApiError.NotFound),
  )
  .prefix('/tasks') {}
