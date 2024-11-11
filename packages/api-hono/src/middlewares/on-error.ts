import type { ErrorHandler } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'

import { StatusCodes } from 'http-status-codes'
import * as process from 'node:process'

export const onError: ErrorHandler = (err, c) => {
  const currentStatus = 'status' in err ? err.status : c.newResponse(null).status
  const statusCode =
    currentStatus === StatusCodes.OK
      ? StatusCodes.INTERNAL_SERVER_ERROR
      : (currentStatus as StatusCode)
  const env = process.env?.['NODE_ENV']
  return c.json(
    {
      message: err.message,
      stack: env === 'production' ? undefined : [err.stack],
    },
    statusCode,
  )
}
