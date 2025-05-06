import { NodeRuntime } from '@effect/platform-node'
import { Duration, Effect, Layer, Schedule } from 'effect'

import { HttpLive } from './http.js'

HttpLive.pipe(
  Layer.launch,
  Effect.tapErrorCause(Effect.logError),
  Effect.retry({
    schedule: Schedule.exponential('1 second', 2).pipe(
      Schedule.modifyDelay(Duration.min('8 seconds')),
      Schedule.jittered,
      Schedule.repetitions,
      Schedule.modifyDelayEffect((count, delay) =>
        Effect.as(
          Effect.logError(
            `[Server crashed]: Retrying in ${Duration.format(delay)} (attempt #${count + 1})`,
          ),
          delay,
        ),
      ),
    ),
    while: (error) => error._tag === 'DatabaseConnectionLostError',
  }),
  NodeRuntime.runMain({ disableErrorReporting: true }),
)
