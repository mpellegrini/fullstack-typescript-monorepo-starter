import { sequence } from '@sveltejs/kit/hooks'

import { type Session, type User, lucia } from '@packages/auth-lucia'

import type { Cookies, Handle } from '@sveltejs/kit'

export interface CookieAttributes {
  secure?: boolean
  path?: string
  domain?: string
  sameSite?: 'lax' | 'strict' | 'none'
  httpOnly?: boolean
  maxAge?: number
  expires?: Date
}

export const setCookie = (
  name: string,
  value: string,
  options: CookieAttributes = {},
  cookies: Cookies,
): void => {
  cookies.set(name, value, {
    path: '.',
    ...options,
  })
}

type ValidatedSession =
  | {
      user: User
      session: Session
    }
  | {
      user: null
      session: null
    }

const authHandler: Handle = async ({ event, resolve }) => {
  let validatedSession: ValidatedSession = {
    user: null,
    session: null,
  }

  const sessionId = event.cookies.get(lucia.sessionCookieName)

  if (sessionId) {
    validatedSession = await lucia.validateSession(sessionId)

    const { session } = validatedSession

    if (session?.fresh) {
      // Session expiration needs to be extended, create a new session cookie
      const { name, value, attributes } = lucia.createSessionCookie(session.id)
      setCookie(name, value, attributes, event.cookies)
    }

    if (!session) {
      // Session is invalid, invalidate existing session cookie
      const { name, value, attributes } = lucia.createBlankSessionCookie()
      setCookie(name, value, attributes, event.cookies)
    }
  }

  event.locals.user = validatedSession.user
  event.locals.session = validatedSession.session

  return resolve(event)
}

export const handle: Handle = sequence(authHandler)
