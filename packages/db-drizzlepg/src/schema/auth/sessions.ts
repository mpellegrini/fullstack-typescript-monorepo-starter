import { relations } from 'drizzle-orm'
import { foreignKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { schema } from './schema.js'
import users from './users.js'

const sessions = schema.table(
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
      fk1: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'sessions_fk_users',
      }),
    }
  },
)

export type SelectSession = typeof sessions.$inferSelect
export type InsertSession = typeof sessions.$inferInsert

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export default sessions
