import { relations } from 'drizzle-orm'

import { namedForeignKey } from '../utils.js'

import { authSchema } from './schema.js'
import users from './users.js'

export const sessions = authSchema.table(
  'sessions',
  (t) => ({
    id: t.text().primaryKey(),
    expiresAt: t.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: t.uuid().notNull(),
  }),
  (t) => ({
    fk1: namedForeignKey(t.userId, users.id),
  }),
)

export default sessions

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export type Session = typeof sessions.$inferSelect
