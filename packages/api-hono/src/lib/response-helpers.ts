import type { Context } from 'hono'

import { z } from '@hono/zod-openapi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- generic, use inferred
export const singleItemResponseWrapperSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      data: dataSchema.openapi({
        description: 'The response data',
      }),
      requestId: z.string().uuid().openapi({
        description: 'The unique request id',
      }),
      success: z.literal(true).openapi({
        description: 'Indicates if the operation was successful',
        example: true,
      }),
      timestamp: z.string().datetime().openapi({
        description: 'The timestamp of the response',
      }),
    })
    .openapi({
      description: 'Single Item Response Wrapper Schema',
    })

export type SingleItemResponseWrapper<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof singleItemResponseWrapperSchema<T>>
>

export const wrapSingleItemResponse = <T extends z.ZodTypeAny>(
  _schema: T,
  data: z.infer<T>,
  ctx?: Context,
): SingleItemResponseWrapper<T> => ({
  data,
  requestId: ctx?.req.header('X-Request-ID') ?? crypto.randomUUID(),
  success: true,
  timestamp: new Date().toISOString(),
})
