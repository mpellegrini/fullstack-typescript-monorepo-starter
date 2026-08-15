import { createRouter } from '../../lib/create-app.ts'

import * as handlers from './tasks.handlers.ts'
import * as routes from './tasks.routes.ts'

const router = createRouter('/tasks') //
  .openapi(routes.findOne, handlers.findOne)

export default router
