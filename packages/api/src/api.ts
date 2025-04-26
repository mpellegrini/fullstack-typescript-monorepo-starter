import { HttpApi, OpenApi } from '@effect/platform'

import { PlatformApi } from './api-platform.js'

export class Api extends HttpApi.make('api') //
  .addHttpApi(PlatformApi)
  .annotateContext(
    OpenApi.annotations({
      title: 'Platform API',
      version: '1.0.0',
    }),
  )
  .prefix('/api') {}
