import { getConnection } from './ha-connection'

export const initHA = async (): Promise<void> => {
  try {
    await getConnection()
    console.log('[HA] Initialized successfully')
  } catch (error) {
    console.error('[HA] Failed to initialize:', error)
  }
}
