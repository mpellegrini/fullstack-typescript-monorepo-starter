import type { Context } from 'hono'

import { z } from '@hono/zod-openapi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- generic, use inferred
export const singleItemResponseWrapperSchema = <T extends z.ZodType>(dataSchema: T) =>
  z
    .object({
      data: dataSchema.openapi({
        description: 'The response data',
      }),
      requestId: z.uuid().openapi({
        description: 'The unique request id',
      }),
      success: z.literal(true).openapi({
        description: 'Indicates if the operation was successful',
        example: true,
      }),
      timestamp: z.iso.datetime().openapi({
        description: 'The timestamp of the response',
      }),
    })
    .openapi({
      description: 'Single Item Response Wrapper Schema',
    })

export interface SingleItemResponseWrapper<T extends z.ZodType> {
  data: z.output<T>
  requestId: string
  success: true
  timestamp: string
}

export const wrapSingleItemResponse = <T extends z.ZodType>(
  _schema: T,
  data: z.infer<T>,
  ctx?: Context,
): SingleItemResponseWrapper<T> => ({
  data,
  requestId: ctx?.req.header('X-Request-ID') ?? crypto.randomUUID(),
  success: true,
  timestamp: new Date().toISOString(),
})
