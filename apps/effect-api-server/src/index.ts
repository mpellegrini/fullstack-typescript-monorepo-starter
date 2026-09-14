import { NodeRuntime } from '@effect/platform-node'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { HttpLive } from './http.ts'
import { TracingLive } from './tracing-live.ts'

Layer.launch(HttpLive.pipe(Layer.provide(TracingLive))).pipe(
  Effect.tapCause(Effect.logFatal),
  NodeRuntime.runMain,
)
