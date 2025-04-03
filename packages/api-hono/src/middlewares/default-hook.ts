import type { Hook } from '@hono/zod-openapi'

import { HTTPException } from 'hono/http-exception'
import { StatusCodes } from 'http-status-codes'

import type { CustomEnv } from '../lib/types.js'

export const defaultHook: Hook<unknown, CustomEnv, never, unknown> = (result, _ctx) => {
  console.error('Global defaultHook', JSON.stringify(result, null, 2))

  if (result.success) {
    return
  }

  throw new HTTPException(StatusCodes.BAD_REQUEST, {
    cause: result.error.errors,
    message: 'Validation failed',
  })

  // return c.json(
  //   {
  //     error: result.error,
  //     success: false,
  //   },
  //   StatusCodes.UNPROCESSABLE_ENTITY,
  // )
}
