import { NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'

import { HttpLive } from './http.js'
import { TracingLive } from './tracing-live.js'

HttpLive.pipe(
  //
  Layer.provide(TracingLive),
  Layer.launch,
  NodeRuntime.runMain({}),
)
