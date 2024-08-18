import { Hono } from 'hono'

import accounts from './controllers/accounts.controller.js'
import { validateAuthSession } from './middlewares/auth.middleware.js'

const app = new Hono().basePath('/api').use(validateAuthSession).route('/', accounts)

export type AppType = typeof app

export default app
