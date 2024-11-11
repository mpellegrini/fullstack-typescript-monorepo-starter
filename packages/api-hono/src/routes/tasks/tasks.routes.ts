import { createRoute } from '@hono/zod-openapi'
import { z } from 'zod'

const tags = ['Tasks']

export const list = createRoute({
  method: 'get',
  path: '/tasks',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              done: z.boolean(),
              name: z.string(),
            }),
          ),
        },
      },
      description: 'Tasks',
    },
  },
  tags,
})

export type ListRoute = typeof list
