import { createRoute, z } from '@hono/zod-openapi'

import type { RouteResponse } from '../../lib/types.js'

import { singleItemResponseWrapperSchema } from '../../lib/response-helpers.js'

import { taskSelectSchema, UuidParamsSchema } from './tasks.schema.js'

const tags = ['Tasks']

const notFoundResponse = (description?: string): RouteResponse => ({
  404: {
    content: {
      'application/json': {
        schema: z.object({ message: z.string(), success: z.literal(false) }),
      },
    },
    description: description ?? 'Not found',
  },
})

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
          schema: singleItemResponseWrapperSchema(taskSelectSchema),
        },
      },
      description: 'The requested task',
    },
    ...notFoundResponse(),
  },
  tags,
})

export type FindOneRoute = typeof findOne
