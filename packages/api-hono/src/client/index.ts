import { type ClientRequestOptions, hc } from 'hono/client'

import type app from '../index.js'

type AppType = typeof app

export type ApiClient = ReturnType<typeof hc<AppType>>

export const apiClient = (baseUrl: string, options?: ClientRequestOptions): ApiClient =>
  hc<AppType>(baseUrl, options)
