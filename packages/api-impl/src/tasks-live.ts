import { HttpApiBuilder } from '@effect/platform'
import { Effect } from 'effect'

import { type Task, Api, TaskId, wrapSingleItemResponse } from '@packages/api'

export const taskGroupLive = HttpApiBuilder.group(Api, 'tasks', (handlers) =>
  handlers.handle('getTaskById', ({ path }) =>
    Effect.succeed(
      wrapSingleItemResponse<Task>({
        id: TaskId.make(path.id),
        done: false,
        name: 'My Found Task',
      }),
    ),
  ),
)
