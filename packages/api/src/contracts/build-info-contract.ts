import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema, OpenApi } from 'effect/unstable/httpapi'
import status from 'http-status'

import * as CustomHttpApiError from '../custom-httpapi-error.ts'
import { BuildInfo } from '../domain.ts'
import { singleItemResponseWrapperSchema } from '../response-helpers.ts'

export class ApiGroup extends HttpApiGroup.make('info') //
  .add(
    HttpApiEndpoint.get('getBuidInfo', '/build-info', {
      error: CustomHttpApiError.InternalServerError,
      success: singleItemResponseWrapperSchema(BuildInfo).pipe(HttpApiSchema.status(status.OK)),
    })
      .annotate(OpenApi.Summary, 'Get Build Info')
      .annotate(OpenApi.Description, 'Returns the build information for the running service'),
  )
  .annotateMerge(
    OpenApi.annotations({
      description: 'Service build and version information',
      title: 'Info',
    }),
  ) {}
