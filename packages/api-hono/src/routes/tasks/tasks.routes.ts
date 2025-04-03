import { createRoute, z } from '@hono/zod-openapi'

import { taskSelectSchema, UuidParamsSchema } from './tasks.schema.js'

const tags = ['Tasks']

export const findOne = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: UuidParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: taskSelectSchema,
        },
      },
      description: 'The requested task',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Not found',
    },
  },
  tags,
})

export type FindOneRoute = typeof findOne
