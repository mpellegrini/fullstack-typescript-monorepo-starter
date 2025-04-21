import { Schema } from 'effect'

export class Pokemon extends Schema.Class<Pokemon>('Pokemon')({
  id: Schema.Number,
  height: Schema.Number,
  name: Schema.String,
  order: Schema.Number,
  weight: Schema.Number,
}) {}
