import { HttpApiBuilder } from '@effect/platform'
import { Layer } from 'effect'

import { Api } from '@packages/api'

import { taskGroupLive } from './tasks-live.js'

export const ApiLive = HttpApiBuilder
  //
  .api(Api)
  .pipe(Layer.provide(taskGroupLive))
