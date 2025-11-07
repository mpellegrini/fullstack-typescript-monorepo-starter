import type { RequestHandler } from '@sveltejs/kit'

export const fallback: RequestHandler = () =>
  Response.json(
    { success: true },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    },
  )
