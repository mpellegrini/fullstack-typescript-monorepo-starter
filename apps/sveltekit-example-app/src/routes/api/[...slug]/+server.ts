import type { RequestHandler } from '@sveltejs/kit'

import app from '@packages/api'

export const fallback: RequestHandler = ({ request }) => app.fetch(request)
