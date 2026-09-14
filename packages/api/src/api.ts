import { HttpApi, OpenApi } from 'effect/unstable/httpapi'

import { PlatformApi } from './api-platform.ts'

/**
 * After defining your groups, you can combine them into one HttpApi representing
 * your entire set of endpoints.
 */
export class Api extends HttpApi.make('api') //
  .addHttpApi(PlatformApi)
  .annotateMerge(
    OpenApi.annotations({
      title: 'Platform API',
      version: '1.0.0',
    }),
  )
  .prefix('/api') {}
