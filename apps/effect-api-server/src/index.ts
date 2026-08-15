import { NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'

import { HttpLive } from './http.ts'
import { TracingLive } from './tracing-live.ts'

HttpLive.pipe(
  //
  Layer.provide(TracingLive),
  Layer.launch,
  NodeRuntime.runMain({}),
)
