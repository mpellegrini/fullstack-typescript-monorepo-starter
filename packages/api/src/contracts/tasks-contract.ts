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
import { Task } from '../domain.js'
import { singleItemResponseWrapperSchema } from '../response-helpers.js'

export const UuidParamSchema = HttpApiSchema.param('id', Schema.UUID)

export class ApiGroup extends HttpApiGroup.make('tasks') //
  .add(
    HttpApiEndpoint.get('getTaskById')`/${UuidParamSchema}`
      .addSuccess(singleItemResponseWrapperSchema(Task), { status: status.OK })
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
