import type { HassEntities, HassEntity } from '$lib/types/ha'

let entities = $state<HassEntities>({})
let connected = $state(false)
let eventSource: EventSource | undefined

export const initEntityState = (initialEntities: HassEntities): void => {
  entities = initialEntities
  connected = Object.keys(initialEntities).length > 0

  if (globalThis.window === undefined) return

  eventSource?.close()
  eventSource = new EventSource('/api/sse')

  eventSource.addEventListener('open', () => {
    connected = true
  })

  eventSource.addEventListener('state', (event: MessageEvent<string>) => {
    entities = JSON.parse(event.data) as HassEntities
  })

  eventSource.addEventListener('error', () => {
    connected = false
  })
}

export const getEntityState = (): {
  readonly connected: boolean
  readonly entities: HassEntities
} =>
  ({
    get connected() {
      return connected
    },
    get entities() {
      return entities
    },
  }) as const

export const getEntity = (entityId: string): HassEntity | undefined => entities[entityId]

export const destroyEntityState = (): void => {
  eventSource?.close()
  eventSource = undefined
  connected = false
}
