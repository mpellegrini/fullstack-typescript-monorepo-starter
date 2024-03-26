import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { citext } from './custom-types.js'

export { count } from 'drizzle-orm'

export const authSchema = pgSchema('auth')

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: citext('user_name').notNull(),
  hashedPassword: text('hashed_password').notNull(),
})

export const sessions = authSchema.table('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})
