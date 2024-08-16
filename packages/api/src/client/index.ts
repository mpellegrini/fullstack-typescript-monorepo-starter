import { type ClientRequestOptions, hc } from 'hono/client'

import type { AppType } from '../index.js'

export type ApiClient = ReturnType<typeof hc<AppType>>

export const apiClient = (baseUrl: string, options?: ClientRequestOptions): ApiClient =>
  hc<AppType>(baseUrl, options)
