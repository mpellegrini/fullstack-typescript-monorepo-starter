import { text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { namedForeignKey } from '../helpers.js'

import { authSchema } from './schema.js'
import { usersTable } from './users.js'

export const sessionsTable = authSchema.table(
  'sessions',
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: uuid().notNull(),
  },
  (t) => [namedForeignKey(t.userId, usersTable.id)],
)

export type SessionEntity = typeof sessionsTable.$inferSelect
export type SessionEntityInsert = typeof sessionsTable.$inferInsert
