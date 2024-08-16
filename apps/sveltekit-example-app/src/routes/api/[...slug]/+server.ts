import type { RequestHandler } from '@sveltejs/kit'

import api from '@packages/api'

export const fallback: RequestHandler = ({ request }) => api.fetch(request)
