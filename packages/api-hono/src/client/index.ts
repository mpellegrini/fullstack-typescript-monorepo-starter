import { type ClientRequestOptions, hc } from 'hono/client'

import type app from '../index.ts'

type AppType = typeof app

export type ApiClient = ReturnType<typeof hc<AppType>>

export const apiClient = (baseUrl: string, options?: ClientRequestOptions): ApiClient =>
  hc<AppType>(baseUrl, options)
