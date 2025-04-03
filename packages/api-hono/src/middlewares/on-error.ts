import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { StatusCodes } from 'http-status-codes'
import * as process from 'node:process'

export const onError: ErrorHandler = (err, c) => {
  console.log('Global ErrorHandler', JSON.stringify(err, null, 2))
  const currentStatus = 'status' in err ? err.status : c.newResponse(null).status
  const statusCode =
    currentStatus === StatusCodes.OK
      ? StatusCodes.INTERNAL_SERVER_ERROR
      : (currentStatus as ContentfulStatusCode)

  return c.json(
    {
      cause: err.cause ?? 'unknown',
      message: err.message,
      stack: process.env['NODE_ENV'] === 'production' ? undefined : [err.stack],
    },
    statusCode,
  )
}
