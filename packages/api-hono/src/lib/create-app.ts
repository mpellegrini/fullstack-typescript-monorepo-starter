import { OpenAPIHono } from '@hono/zod-openapi'

import type { AppOpenApi, CustomEnv } from './types.ts'

import { defaultHook, notFound, onError } from '../middlewares/index.ts'

export const createRouter = (basePath = '/'): AppOpenApi =>
  new OpenAPIHono<CustomEnv>({
    defaultHook,
    strict: true,
  }).basePath(basePath)

export const createApp = (basePath = '/'): AppOpenApi => {
  const app = createRouter(basePath)

  app.notFound(notFound)
  app.onError(onError)

  return app
}
