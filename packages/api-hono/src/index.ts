import { logger } from 'hono/logger'

import { configureOpenAPI } from './lib/configure-openapi.js'
import { createApp } from './lib/create-app.js'
import taskRoutes from './routes/tasks/tasks.index.js'

const rootApp = createApp()

rootApp.use('*', logger())

const app = rootApp //
  .basePath('/api')
  .route('/', taskRoutes)

configureOpenAPI(app)

export default app

console.log(app.routes)
