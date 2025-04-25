import type { RequestHandler } from '@sveltejs/kit'

export const fallback: RequestHandler = () =>
  new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
  })
