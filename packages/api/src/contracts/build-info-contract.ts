import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform'
import status from 'http-status'

import { BuildInfo } from '../domain.js'
import { singleItemResponseWrapperSchema } from '../response-helpers.js'

export class ApiGroup extends HttpApiGroup.make('info') //
  .add(
    HttpApiEndpoint.get('getBuidInfo')`/build-info`
      .annotate(OpenApi.Summary, 'Get Build Info')
      .annotate(OpenApi.Description, 'Returns the build information for the running service')
      .addSuccess(singleItemResponseWrapperSchema(BuildInfo), { status: status.OK }),
  )
  .annotateContext(
    OpenApi.annotations({
      description: 'Service build and version information',
      title: 'Info',
    }),
  ) {}
