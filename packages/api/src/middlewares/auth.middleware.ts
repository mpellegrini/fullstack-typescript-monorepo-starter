import type { MiddlewareHandler } from 'hono'

import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import type { CustomEnv } from '../types/index.js'

const AUTHORIZATION = 'Authorization'

export const validateAuthSession: MiddlewareHandler<CustomEnv> = createMiddleware(
  async (c, next) => {
    // Get the token from a cookie for non-API requests
    const cookie_token = getCookie(c, 'sessionCookieName')

    // Get the token from the 'Authorization: Bearer <token>' header for API requests
    const bearer_token = c.req.header(AUTHORIZATION)?.split(' ')[1]

    const access_token = cookie_token ?? bearer_token

    if (access_token) {
      // Validate user session
      // TODO: Need to implement the ability to refresh/extend access tokens when
      //       api is not running in the SvelteKit context
      // if (session?.fresh) {
      // Session expiration needs to be extended, create a new session cookie
      // setCookie(c, name, value, { path: '.', ...attributes })
      // }
      // if (!session) {
      // TODO: Need to implement the ability to invalidate access tokens when
      //       api is not running in the SvelteKit context
      // Session is invalid, invalidate existing session cookie
      // const { attributes, name, value } = lucia.createBlankSessionCookie()
      // setCookie(c, name, value, { path: '.', ...attributes })
      // }
    }

    c.set('session', 'sessions-12345')
    c.set('user', 'user-bob')

    return next()
  },
)
