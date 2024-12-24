import { relations } from 'drizzle-orm'
import { text, uuid } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'
import { namedUnique } from '../helpers.js'

import { authSchema } from './schema.js'
import { sessionsTable } from './sessions.js'

export const usersTable = authSchema.table(
  'users',
  {
    id: uuid().primaryKey().defaultRandom(),
    hashedPassword: text().notNull(),
    username: citext().notNull(),
  },
  (t) => [namedUnique(t.username)],
)

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}))

export type User = typeof usersTable.$inferSelect
