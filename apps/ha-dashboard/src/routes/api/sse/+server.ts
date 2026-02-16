import { getEntities, subscribeToChanges } from '$lib/server/ha-connection'

import type { RequestHandler } from './$types'

const HEARTBEAT_INTERVAL_MS = 30_000

export const GET: RequestHandler = () => {
  let unsubscribe: undefined | (() => void)
  let heartbeat: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream({
    cancel: () => {
      unsubscribe?.()
      clearInterval(heartbeat)
    },
    start: (controller) => {
      const encoder = new TextEncoder()

      const send = (event: string, data: string): void => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`))
      }

      // Send initial full state
      send('state', JSON.stringify(getEntities()))

      // Stream updates
      unsubscribe = subscribeToChanges((entities) => {
        send('state', JSON.stringify(entities))
      })

      // Keep-alive heartbeat
      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': heartbeat\n\n'))
      }, HEARTBEAT_INTERVAL_MS)
    },
  })

  return new Response(stream, {
    headers: {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    },
  })
}
