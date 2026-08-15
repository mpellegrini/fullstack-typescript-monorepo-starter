import { HttpApiBuilder } from '@effect/platform'
import { Layer } from 'effect'

import { Api } from '@packages/api'

import { buildInfoGroupLive } from './build-info-live.ts'
import { taskGroupLive } from './tasks-live.ts'

export const ApiLive = HttpApiBuilder
  //
  .api(Api)
  .pipe(Layer.provide(taskGroupLive), Layer.provide(buildInfoGroupLive))
