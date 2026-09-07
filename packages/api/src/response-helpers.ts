import { Schema } from 'effect'

export interface SingleItemResponseWrapper<T> {
  readonly data: T
  readonly success: true
  readonly timestamp: string
}

export const singleItemResponseWrapperSchema = <A, I, RD, RE>(
  itemSchema: Schema.Codec<A, I, RD, RE>,
): Schema.Codec<SingleItemResponseWrapper<A>, SingleItemResponseWrapper<I>, RD, RE> =>
  Schema.Struct({
    data: itemSchema,
    success: Schema.Literal(true),
    timestamp: Schema.String.annotate({
      examples: ['2025-07-25T12:30:18.956Z'],
    }),
  })

export const wrapSingleItemResponse = <T>(item: T): SingleItemResponseWrapper<T> => ({
  data: item,
  success: true,
  timestamp: new Date().toISOString(),
})
