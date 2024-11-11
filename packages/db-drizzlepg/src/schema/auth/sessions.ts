import { relations } from 'drizzle-orm'
import { text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { namedForeignKey } from '../utils.js'

import { authSchema } from './schema.js'
import users from './users.js'

export const sessions = authSchema.table(
  'sessions',
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: uuid().notNull(),
  },
  (t) => [namedForeignKey(t.userId, users.id)],
)

export default sessions

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export type Session = typeof sessions.$inferSelect
