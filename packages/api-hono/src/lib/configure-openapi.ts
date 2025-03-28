import { apiReference } from '@scalar/hono-api-reference'

import type { AppOpenApi } from './types.js'

export const configureOpenAPI = (app: AppOpenApi): void => {
  app.doc('/openapi.json', {
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    openapi: '3.0.0',
  })

  app.get(
    '/ui-scalar',
    apiReference({
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'node',
      },
      layout: 'classic',
      theme: 'kepler',
      url: '/openapi.json',
    }),
  )
}
