import type { PageServerLoad } from './$types'

const getSignInUrl = (): Promise<string> => {
  const baseUrl = 'http://homeassistant-test.local:8123'

  const loginUrl = new URL('/user/authorize', baseUrl)
  loginUrl.searchParams.set('response_type', 'code')
  loginUrl.searchParams.set('client_id', 'http://localhost:5173')
  loginUrl.searchParams.set('redirect_uri', 'http://localhost:5173/callback')
  return Promise.resolve(loginUrl.toString())
}

export const load: PageServerLoad = async () => ({ signInUrl: await getSignInUrl() })
