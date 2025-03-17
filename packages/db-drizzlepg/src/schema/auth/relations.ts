import { relations } from 'drizzle-orm'

import { sessionsTable } from './sessions.js'
import { usersTable } from './users.js'

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}))

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}))
