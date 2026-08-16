import * as pg from 'drizzle-orm/pg-core'

import { namedForeignKey, withSurrogateId } from '../helpers.ts'

import { userAccountsTable } from './accounts.ts'

export const userSessionsTable = pg.snakeCase.table(
  'user_sessions',
  {
    ...withSurrogateId,
    expiresAt: pg.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: pg.uuid().notNull(),
  },
  (t) => [namedForeignKey(t.userId, userAccountsTable.id).onDelete('cascade')],
)

export type UserSessionEntity = typeof userSessionsTable.$inferSelect
export type NewUserSessionEntity = typeof userSessionsTable.$inferInsert
