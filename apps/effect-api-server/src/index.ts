import { NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'

import { HttpLive } from './http.js'

HttpLive.pipe(
  //
  Layer.launch,
  NodeRuntime.runMain({}),
)
