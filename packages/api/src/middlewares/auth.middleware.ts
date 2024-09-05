import type { MiddlewareHandler } from 'hono'

import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import { type Session, type User, lucia } from '@packages/auth-lucia'

import type { CustomEnv } from '../types/index.js'

type ValidatedAuthSession =
  | {
      session: null
      user: null
    }
  | {
      session: Session
      user: User
    }

const AUTHORIZATION = 'Authorization'

export const validateAuthSession: MiddlewareHandler<CustomEnv> = createMiddleware(
  async (c, next) => {
    let validatedAuthSession: ValidatedAuthSession = {
      session: null,
      user: null,
    }

    // Get the token from a cookie for non-API requests
    const cookie_token = getCookie(c, lucia.sessionCookieName)

    // Get the token from the 'Authorization: Bearer <token>' header for API requests
    const bearer_token = c.req.header(AUTHORIZATION)?.split(' ')[1]

    const access_token = cookie_token ?? bearer_token

    if (access_token) {
      validatedAuthSession = await lucia.validateSession(access_token)

      const { session } = validatedAuthSession

      // TODO: Need to implement the ability to refresh/extend access tokens when
      //       api is not running in the SvelteKit context
      if (session?.fresh) {
        // Session expiration needs to be extended, create a new session cookie
        const { attributes, name, value } = lucia.createSessionCookie(session.id)
        setCookie(c, name, value, { path: '.', ...attributes })
      }

      if (!session) {
        // TODO: Need to implement the ability to invalidate access tokens when
        //       api is not running in the SvelteKit context
        // Session is invalid, invalidate existing session cookie
        const { attributes, name, value } = lucia.createBlankSessionCookie()
        setCookie(c, name, value, { path: '.', ...attributes })
      }
    }

    c.set('session', validatedAuthSession.session)
    c.set('user', validatedAuthSession.user)

    return next()
  },
)
