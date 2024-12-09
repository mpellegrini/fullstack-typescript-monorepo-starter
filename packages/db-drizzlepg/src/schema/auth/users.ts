import { relations } from 'drizzle-orm'

import { citext } from '../custom-types.js'
import { namedUnique } from '../utils.js'

import { authSchema } from './schema.js'
import { sessionsTable } from './sessions.js'

export const usersTable = authSchema.table(
  'users',
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    hashedPassword: t.text().notNull(),
    username: citext().notNull(),
  }),
  (t) => [namedUnique(t.username)],
)

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}))

export type User = typeof usersTable.$inferSelect
