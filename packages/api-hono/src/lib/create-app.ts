import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'

import type { AppOpenApi, CustomEnv } from './types.js'

import { defaultHook } from '../middlewares/default-hook.js'
import { notFound, onError } from '../middlewares/index.js'

export const createRouter = (): AppOpenApi =>
  new OpenAPIHono<CustomEnv>({ defaultHook, strict: true })

export const createApp = (basePath = '/'): AppOpenApi => {
  const app = createRouter().basePath(basePath)

  app.notFound(notFound)
  app.onError(onError)

  app.use('*', logger())

  return app
}
