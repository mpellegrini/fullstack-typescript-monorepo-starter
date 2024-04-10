import { relations } from 'drizzle-orm'
import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { citext } from './custom-types.js'

export const authSchema = pgSchema('auth')

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: citext('username').notNull().unique(),
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

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
