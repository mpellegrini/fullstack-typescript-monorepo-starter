import type { Hook } from '@hono/zod-openapi'

import { HTTPException } from 'hono/http-exception'
import { StatusCodes } from 'http-status-codes'

import type { CustomEnv } from '../lib/types.js'

export const defaultHook: Hook<unknown, CustomEnv, never, unknown> = (result, _ctx) => {
  if (!result.success) {
    console.error('Global HonoZodOpenApiHook', JSON.stringify(result, null, 2))

    throw new HTTPException(StatusCodes.BAD_REQUEST, {
      cause: result.error,
      message: 'Validation failed',
    })
  }
}
