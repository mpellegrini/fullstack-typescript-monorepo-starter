import { serve } from '@hono/node-server'

import app from './app.js'
import env from './env.js'

serve(
  {
    fetch: app.fetch,
    port: env.NODE_PORT,
  },
  (info) => {
    console.info(`Server is running on http://localhost:${info.port}`)
  },
)
