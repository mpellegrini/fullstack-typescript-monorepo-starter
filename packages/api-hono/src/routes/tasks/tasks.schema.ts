import { z } from '@hono/zod-openapi'

export const taskBaseSchema = z.object({
  id: z.string().uuid(),
  done: z.boolean(),
  name: z.string().min(1).max(250),
})

export const taskSelectSchema = taskBaseSchema
export const taskInsertSchema = taskBaseSchema.omit({ id: true })
export const patchTaskSchema = taskInsertSchema.partial()

export const UuidParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      example: '620fc96a-ebd8-4d7e-ad51-b318bbd987de',
      param: {
        in: 'path',
        name: 'id',
      },
    }),
})
