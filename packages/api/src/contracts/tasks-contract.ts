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

export const UuidParamSchema = HttpApiSchema.param('id', Schema.UUID).annotations({
  examples: ['df7b3075-8e5d-49fd-8746-a2ff2fda676d'],
})

export class ApiGroup extends HttpApiGroup.make('tasks') //
  .add(
    HttpApiEndpoint.get('getTaskById')`/${UuidParamSchema}`
      .annotate(OpenApi.Summary, 'Get Task By Id')
      .annotate(OpenApi.Description, 'This is the description')
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
