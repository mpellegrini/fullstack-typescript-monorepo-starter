import { sequence } from '@sveltejs/kit/hooks'

import { type Session, type User, lucia } from '@packages/auth-lucia'

import type { Handle, RequestEvent } from '@sveltejs/kit'
import type { Cookie } from 'oslo/cookie'

const setSessionCookie = (sessionCookie: Cookie, event: RequestEvent): void => {
  event.cookies.set(sessionCookie.name, sessionCookie.value, {
    path: '.',
    ...sessionCookie.attributes,
  })
}

const authHandler: Handle = async ({ event, resolve }) => {
  let validatedSession: {
    user: User | null
    session: Session | null
  } = {
    user: null,
    session: null,
  }

  const sessionId = event.cookies.get(lucia.sessionCookieName)

  if (sessionId) {
    validatedSession = await lucia.validateSession(sessionId)

    const { session } = validatedSession

    if (session?.fresh) {
      // Session expiration needs to be extended, create a new session cookie
      setSessionCookie(lucia.createSessionCookie(session.id), event)
    }

    if (!session) {
      // Session is invalid, invalidate existing session cookie
      setSessionCookie(lucia.createBlankSessionCookie(), event)
    }
  }

  //TODO - need to map user and session to non-lucia types
  event.locals.user = validatedSession.user
  event.locals.session = validatedSession.session

  return resolve(event)
}

export const handle: Handle = sequence(authHandler)
