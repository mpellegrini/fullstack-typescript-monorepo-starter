import { configureOpenAPI } from './lib/configure-openapi.js'
import { createApp } from './lib/create-app.js'
import taskRoutes from './routes/tasks/tasks.index.js'

const app = createApp('/api') //
  .route('/', taskRoutes)

configureOpenAPI(app)

export type AppType = typeof app

export default app
