import { Effect } from 'effect'
import { HttpApiBuilder } from 'effect/unstable/httpapi'

import { Api, Task, TaskId, wrapSingleItemResponse } from '@packages/api'

export const taskGroupLive = HttpApiBuilder.group(Api, 'tasks', (handlers) =>
  handlers.handle('getTaskById', ({ params }) =>
    Effect.succeed(
      new Task({
        id: TaskId.make(params.id),
        done: false,
        name: 'My Found Task',
      }),
    ).pipe(Effect.map(wrapSingleItemResponse)),
  ),
)
