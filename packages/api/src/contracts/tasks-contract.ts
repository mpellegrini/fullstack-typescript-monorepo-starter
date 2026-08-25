import { Schema } from 'effect'
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema, OpenApi } from 'effect/unstable/httpapi'
import status from 'http-status'

import * as CustomHttpApiError from '../custom-httpapi-error.ts'
import { Task } from '../domain.ts'
import { singleItemResponseWrapperSchema } from '../response-helpers.ts'

export const UuidParamSchema = Schema.String.check(Schema.isUUID()).annotate({
  examples: ['df7b3075-8e5d-49fd-8746-a2ff2fda676d'],
})

export class ApiGroup extends HttpApiGroup.make('tasks') //
  .add(
    HttpApiEndpoint.get('getTaskById', '/:id', {
      error: [
        CustomHttpApiError.BadRequest,
        CustomHttpApiError.NotFound,
        CustomHttpApiError.InternalServerError,
      ],
      params: { id: UuidParamSchema },
      success: singleItemResponseWrapperSchema(Task).pipe(HttpApiSchema.status(status.OK)),
    })
      .annotate(OpenApi.Summary, 'Get Task By Id')
      .annotate(OpenApi.Description, 'This is the description'),
  )
  .prefix('/tasks')
  .annotateMerge(
    OpenApi.annotations({
      description: 'API for managing tasks',
      title: 'Tasks',
    }),
  ) {}
