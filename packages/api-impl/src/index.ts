import { HttpApiBuilder } from '@effect/platform'
import { Effect } from 'effect'

import { PlatformApi, TodoId } from '@packages/api'

export const taskGroupLive = HttpApiBuilder.group(PlatformApi, 'tasks', (handlers) =>
  handlers.handle('getTaskById', ({ path }) =>
    Effect.succeed({
      id: TodoId.make(path.id),
      done: false,
      name: 'My Found Task',
    }),
  ),
)
