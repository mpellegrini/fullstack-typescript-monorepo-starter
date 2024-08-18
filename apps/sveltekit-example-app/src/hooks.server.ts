import type { Handle } from '@sveltejs/kit'

import { sequence } from '@sveltejs/kit/hooks'

import { apiClientHandler } from '$lib/server/api-client-handler.js'

export const handle: Handle = sequence(apiClientHandler)
