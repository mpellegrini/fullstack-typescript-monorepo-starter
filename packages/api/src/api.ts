import { HttpApi } from '@effect/platform'

import { PlatformApi } from './api-platform.js'

export class Api extends HttpApi.make('api') //
  .addHttpApi(PlatformApi)
  .prefix('/api') {}
