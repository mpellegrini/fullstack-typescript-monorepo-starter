import { json } from '@sveltejs/kit'

import { callHAService } from '$lib/server/ha-connection'
import type { ServiceCallRequest, ServiceCallResponse } from '$lib/types/ha'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as ServiceCallRequest

  if (!body.domain || !body.service) {
    return json(
      {
        error: 'Missing required fields: domain, service',
        success: false,
      } satisfies ServiceCallResponse,
      {
        status: 400,
      },
    )
  }

  try {
    await callHAService(body)
    return json({ success: true } satisfies ServiceCallResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[HA] Service call failed:', message)
    return json({ error: message, success: false } satisfies ServiceCallResponse, { status: 500 })
  }
}
