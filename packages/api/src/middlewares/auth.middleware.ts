import type { MiddlewareHandler } from 'hono'

import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import { type Session, type User, lucia } from '@packages/auth-lucia'

import type { HonoTypes } from '../types/index.js'

type ValidatedAuthSession =
  | {
      session: null
      user: null
    }
  | {
      session: Session
      user: User
    }

export const validateAuthSession: MiddlewareHandler<HonoTypes> = createMiddleware(
  async (c, next) => {
    let validatedAuthSession: ValidatedAuthSession = {
      session: null,
      user: null,
    }

    const sessionId = getCookie(c, lucia.sessionCookieName)

    if (sessionId) {
      validatedAuthSession = await lucia.validateSession(sessionId)

      const { session } = validatedAuthSession

      if (session?.fresh) {
        // Session expiration needs to be extended, create a new session cookie
        const { attributes, name, value } = lucia.createSessionCookie(session.id)
        setCookie(c, name, value, { path: '.', ...attributes })
      }

      if (!session) {
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
