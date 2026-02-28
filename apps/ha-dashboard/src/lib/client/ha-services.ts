import type { ServiceCallRequest, ServiceCallResponse } from '$lib/types/ha'

export const callService = async (request: ServiceCallRequest): Promise<ServiceCallResponse> => {
  const response = await fetch('/api/services', {
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  return response.json() as Promise<ServiceCallResponse>
}
