import { createRoute } from '@hono/zod-openapi'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { createRouter } from '../lib/create-app.js'

const router = createRouter().openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
        description: 'API Index',
      },
    },
  }),
  (c) =>
    c.json(
      {
        message: 'API Index',
      },
      StatusCodes.OK,
    ),
)

export default router
