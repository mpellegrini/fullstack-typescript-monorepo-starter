import { getConnection } from './ha-connection'

export const initHA = (): void => {
  getConnection()
    .then(() => {
      console.log('[HA] Initialized successfully')
      return
    })
    .catch((error: unknown) => {
      console.error('[HA] Failed to initialize:', error)
    })
}
