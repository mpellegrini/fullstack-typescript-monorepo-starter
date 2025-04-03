import { apiReference } from '@scalar/hono-api-reference'

import type { AppOpenApi } from './types.js'

export const configureOpenAPI = (app: AppOpenApi): void => {
  const openAPI31Document = app.getOpenAPI31Document({
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    openapi: '3.1.0',
  })

  app.get(
    '/reference',
    apiReference({
      content: openAPI31Document,
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'node',
      },
      layout: 'classic',
      pageTitle: openAPI31Document.info.title,
      theme: 'kepler',
    }),
  )
}
