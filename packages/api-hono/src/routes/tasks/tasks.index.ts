import { createRouter } from '../../lib/create-app.js'

import * as handlers from './tasks.handlers.js'
import * as routes from './tasks.routes.js'

const router = createRouter() //
  .basePath('/tasks')
  .openapi(routes.findOne, handlers.findOne)

export default router
