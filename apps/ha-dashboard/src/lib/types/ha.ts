export type {
  HassEntities,
  HassEntity,
  HassEntityAttributeBase,
  HassEntityBase,
} from 'home-assistant-js-websocket'

export interface ServiceCallRequest {
  domain: string
  service: string
  service_data?: Record<string, unknown>
  target?: {
    area_id?: string[] | string
    device_id?: string[] | string
    entity_id?: string[] | string
  }
}

export interface ServiceCallResponse {
  error?: string
  success: boolean
}
