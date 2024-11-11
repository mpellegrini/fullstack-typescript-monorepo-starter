import type { AppRouteHandler } from '../../lib/types.js'

import type { ListRoute } from './tasks.routes.js'

export const list: AppRouteHandler<ListRoute> = (c) =>
  c.json([
    {
      done: false,
      name: 'Learn Hono',
    },
    {
      done: false,
      name: 'Commit',
    },
  ])
