import { Effect } from 'effect'
import { HttpApiBuilder } from 'effect/unstable/httpapi'

import { Api, Task, TaskId, wrapSingleItemResponse } from '@packages/api'

/**
 * The HttpApiBuilder.group() API is used to implement a specific group of
 * endpoints within an HttpApi definition.
 *
 * The HttpApiBuilder.group() API produces a Layer that can later be
 * provided to the server implementation.
 */
export const taskGroupLive = HttpApiBuilder.group(Api, 'tasks', (handlers) =>
  handlers.handle('getTaskById', ({ params }) =>
    Effect.succeed(
      new Task({
        id: TaskId.make(params.id),
        done: false,
        title: 'My Found Task',
      }),
    ).pipe(Effect.map(wrapSingleItemResponse)),
  ),
)
