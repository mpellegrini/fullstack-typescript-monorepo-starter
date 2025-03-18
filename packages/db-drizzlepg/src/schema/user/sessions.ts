import { timestamp, uuid } from 'drizzle-orm/pg-core'

import { namedForeignKey, withSurrogateId } from '../helpers.js'

import { userAccountsTable } from './accounts.js'
import { userSchema } from './schema.js'

export const userSessionsTable = userSchema.table(
  'sessions',
  {
    ...withSurrogateId,
    expiresAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: uuid().notNull(),
  },
  (t) => [namedForeignKey(t.userId, userAccountsTable.id).onDelete('cascade')],
)

export type SessionEntity = typeof userSessionsTable.$inferSelect
export type SessionEntityInsert = typeof userSessionsTable.$inferInsert
