import { HttpApiBuilder } from '@effect/platform'
import { Effect } from 'effect'

import { Api, TodoId } from '@packages/api'

export const taskGroupLive = HttpApiBuilder.group(Api, 'tasks', (handlers) =>
  handlers.handle('getTaskById', ({ path }) =>
    Effect.succeed({
      id: TodoId.make(path.id),
      done: false,
      name: 'My Found Task',
    }),
  ),
)
