import { relations } from 'drizzle-orm'
import { text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { namedForeignKey } from '../utils.js'

import { authSchema } from './schema.js'
import users from './users.js'

const sessions = authSchema.table(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      fk1: namedForeignKey(table.userId, users.id),
    }
  },
)

export default sessions

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export type Session = typeof sessions.$inferSelect
