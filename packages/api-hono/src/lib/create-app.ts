import { OpenAPIHono } from '@hono/zod-openapi'

import type { AppOpenApi, CustomEnv } from './types.js'

import { defaultHook } from '../middlewares/default-hook.js'
import { notFound, onError } from '../middlewares/index.js'

export const createRouter = (): AppOpenApi =>
  new OpenAPIHono<CustomEnv>({
    defaultHook,
    strict: true,
  })

export const createApp = (): AppOpenApi => {
  const app = createRouter()

  app.notFound(notFound)
  app.onError(onError)

  return app
}
