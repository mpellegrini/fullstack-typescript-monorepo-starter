import { Schema } from 'effect'

export const TodoId = Schema.UUID.pipe(Schema.brand('TodoId'))
export type TodoId = typeof TodoId.Type
