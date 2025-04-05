import type { NotFoundHandler } from 'hono'

import { getReasonPhrase, StatusCodes } from 'http-status-codes'

export const notFound: NotFoundHandler = (c) => {
  console.log('Global notFoud Handler')
  return c.json(
    {
      code: StatusCodes.NOT_FOUND,
      message: `${getReasonPhrase(StatusCodes.NOT_FOUND)} - ${c.req.path}`,
      success: false,
    },
    StatusCodes.NOT_FOUND,
  )
}
