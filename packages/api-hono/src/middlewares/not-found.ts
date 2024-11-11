import type { NotFoundHandler } from 'hono'

import { getReasonPhrase, StatusCodes } from 'http-status-codes'

export const notFound: NotFoundHandler = (c) =>
  c.json(
    {
      message: `${getReasonPhrase(StatusCodes.NOT_FOUND)} - ${c.req.path}`,
    },
    StatusCodes.NOT_FOUND,
  )
