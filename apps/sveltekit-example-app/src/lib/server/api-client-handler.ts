import type { Handle } from '@sveltejs/kit'

import { apiClient } from '@packages/api/client'

// eslint-disable-next-line @typescript-eslint/unbound-method -- false positive
export const apiClientHandler: Handle = ({ event, resolve }) => {
  const { api } = apiClient('/', {
    fetch: event.fetch,
    headers: {
      // TODO: Set access token here from cookie value
      host: event.request.headers.get('host') ?? '',
      'x-forwarded-for': event.getClientAddress(),
    },
  })

  const getAuthedUser = async (): Promise<null | { id: string; username: string }> => {
    const resp = await api.accounts.user.$get()
    if (resp.ok) {
      const { user } = await resp.json()
      return user
    }
    return null
  }

  event.locals.api = api
  event.locals.getAuthedUser = getAuthedUser
  return resolve(event)
}
