import { env } from '$env/dynamic/private'
import {
  type Connection,
  type HassEntities,
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
} from 'home-assistant-js-websocket'
import WebSocket from 'ws'

import type { ServiceCallRequest } from '$lib/types/ha'

// Polyfill WebSocket for Node.js server environment
// @ts-expect-error — ws is API-compatible with browser WebSocket
globalThis.WebSocket = WebSocket

type ChangeListener = (entities: HassEntities) => void

let connectionPromise: Promise<Connection> | undefined
let currentEntities: HassEntities = {}
const listeners = new Set<ChangeListener>()

const connect = async (): Promise<Connection> => {
  const token = env['HOMEASSISTANT_TOKEN']
  const baseUrl = env['HOMEASSISTANT_BASE_URI']

  if (!token) {
    throw new Error('[HA] HOMEASSISTANT_TOKEN environment variable is not set')
  }
  if (!baseUrl) {
    throw new Error('[HA] HOMEASSISTANT_BASE_URI environment variable is not set')
  }

  const auth = createLongLivedTokenAuth(baseUrl, token)
  const connection = await createConnection({ auth })

  console.log('[HA] Connection ready')

  subscribeEntities(connection, (entities) => {
    currentEntities = entities
    for (const listener of listeners) {
      listener(entities)
    }
  })

  connection.addEventListener('disconnected', () => {
    console.warn('[HA] Connection lost, will auto-reconnect')
  })

  connection.addEventListener('ready', () => {
    console.log('[HA] Connection restored')
  })

  return connection
}

export const getConnection = async (): Promise<Connection> => {
  connectionPromise ??= connect()
  return connectionPromise
}

export const getEntities = (): HassEntities => currentEntities

export const subscribeToChanges = (listener: ChangeListener): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const callHAService = async (request: ServiceCallRequest): Promise<void> => {
  const connection = await getConnection()
  await connection.sendMessagePromise({
    domain: request.domain,
    service: request.service,
    service_data: request.service_data,
    target: request.target,
    type: 'call_service',
  })
}
