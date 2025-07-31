import { Schema } from 'effect'

export class BookingDateTime extends Schema.TaggedClass<BookingDateTime>()('BookingDateTime', {
  value: Schema.DateTimeZoned,
}) {}
