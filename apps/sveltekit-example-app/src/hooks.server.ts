import type { Cookies, Handle } from '@sveltejs/kit'

import { sequence } from '@sveltejs/kit/hooks'

import { type Session, type User, lucia } from '@packages/auth-lucia'

export interface CookieAttributes {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'lax' | 'none' | 'strict'
  secure?: boolean
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
      session: null
      user: null
    }
  | {
      session: Session
      user: User
    }

// eslint-disable-next-line @typescript-eslint/unbound-method -- using resolve like this is acceptable
const authHandler: Handle = async ({ event, resolve }) => {
  let validatedSession: ValidatedSession = {
    session: null,
    user: null,
  }

  const sessionId = event.cookies.get(lucia.sessionCookieName)

  if (sessionId) {
    validatedSession = await lucia.validateSession(sessionId)

    const { session } = validatedSession

    if (session?.fresh) {
      // Session expiration needs to be extended, create a new session cookie
      const { attributes, name, value } = lucia.createSessionCookie(session.id)
      setCookie(name, value, attributes, event.cookies)
    }

    if (!session) {
      // Session is invalid, invalidate existing session cookie
      const { attributes, name, value } = lucia.createBlankSessionCookie()
      setCookie(name, value, attributes, event.cookies)
    }
  }

  event.locals.user = validatedSession.user
  event.locals.session = validatedSession.session

  return resolve(event)
}

export const handle: Handle = sequence(authHandler)
