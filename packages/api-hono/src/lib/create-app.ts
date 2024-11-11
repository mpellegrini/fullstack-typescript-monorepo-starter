import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'

import type { AppOpenApi, CustomEnv } from './types.js'

import { notFound, onError, serveEmojiFavicon } from '../middlewares/index.js'

export const createRouter = (): AppOpenApi => new OpenAPIHono<CustomEnv>({ strict: true })

export const createApp = (): AppOpenApi => {
  const app = createRouter()

  app.use(serveEmojiFavicon('🔥'))
  app.use(logger())

  app.notFound(notFound)

  app.onError(onError)

  return app
}
