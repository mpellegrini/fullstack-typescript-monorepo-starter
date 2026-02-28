import { env } from '$env/dynamic/private'

import type { PageServerLoad } from './$types'

const getSignInUrl = (request: Request): string => {
  const loginUrl = new URL('/auth/authorize', env['HOME_ASSISTANT_BASE_URI'])
  loginUrl.searchParams.set('response_type', 'code')
  loginUrl.searchParams.set('client_id', request.url)
  loginUrl.searchParams.set('redirect_uri', `${request.url}callback`)
  loginUrl.searchParams.set('state', `${request.url}`)
  return loginUrl.toString()
}

export const load: PageServerLoad = ({ request }) => ({
  signInUrl: getSignInUrl(request),
})
