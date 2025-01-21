import { configureOpenAPI } from './lib/configure-openapi.js'
import { createApp } from './lib/create-app.js'
import indexRoute from './routes/index.route.js'
import tasks from './routes/tasks/tasks.index.js'

const app = createApp()
configureOpenAPI(app)

const routes = [indexRoute, tasks]

for (const route of routes) {
  app.route('/', route)
}

export default app
