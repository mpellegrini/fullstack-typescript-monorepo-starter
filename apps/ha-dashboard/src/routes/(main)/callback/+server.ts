import { HOMEASSISTANT_BASE_URI } from '$env/static/private'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch, url }) => {
  const code = url.searchParams.get('code')

  const baseUrl = HOMEASSISTANT_BASE_URI

  const tokenUrl = new URL('/auth/token', baseUrl)
  const body = `grant_type=authorization_code&code=${code}&client_id=http%3A%2F%2Flocalhost%3A5173%2F`

  const response = await fetch(tokenUrl.toString(), {
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  return new Response(JSON.stringify(await response.json()))
}
