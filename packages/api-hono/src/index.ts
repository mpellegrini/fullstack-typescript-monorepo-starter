import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'

import { configureOpenAPI } from './lib/configure-openapi.js'
import { createApp } from './lib/create-app.js'
import taskRoutes from './routes/tasks/tasks.index.js'

const app = createApp('/api')

app.use('*', logger())

const routes = app //
  .route('/', taskRoutes)

configureOpenAPI(routes)

export default app

if (process.env['NODE_ENV'] !== 'production') {
  console.log('*** Available routes')
  showRoutes(app, { colorize: true, verbose: true })
  console.log('***')
}
