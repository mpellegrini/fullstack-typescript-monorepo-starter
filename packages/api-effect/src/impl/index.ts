import { HttpApiBuilder } from '@effect/platform'
import { Effect } from 'effect'

import { TodoId } from '../entity-ids.js'
import { PlatformApi } from '../platform-api.js'

export const taskGroupLive = HttpApiBuilder.group(PlatformApi, 'tasks', (handlers) =>
  handlers.handle('getTaskById', ({ path }) =>
    Effect.succeed({
      id: TodoId.make(path.id),
      done: false,
      name: 'My Found Task',
    }),
  ),
)
