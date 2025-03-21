import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { namedForeignKey, withSurrogateId } from '../helpers.js'

import { userAccountsTable } from './accounts.js'

export const userSessionsTable = pgTable(
  'user_sessions',
  {
    ...withSurrogateId,
    expiresAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: uuid().notNull(),
  },
  (t) => [namedForeignKey(t.userId, userAccountsTable.id).onDelete('cascade')],
)

export type UserSessionEntity = typeof userSessionsTable.$inferSelect
export type NewUserSessionEntity = typeof userSessionsTable.$inferInsert
