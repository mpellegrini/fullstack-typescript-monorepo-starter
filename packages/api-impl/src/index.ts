import { Layer } from 'effect'
import { HttpApiBuilder } from 'effect/unstable/httpapi'

import { Api } from '@packages/api'

import { buildInfoGroupLive } from './build-info-live.ts'
import { taskGroupLive } from './tasks-live.ts'

export const ApiLive = HttpApiBuilder
  //
  .layer(Api, { openapiPath: '/openapi.json' })
  .pipe(Layer.provide(taskGroupLive), Layer.provide(buildInfoGroupLive))
