import { relations } from 'drizzle-orm'
import { text } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'
import { namedUnique, withSurrogateId } from '../helpers.js'

import { authSchema } from './schema.js'
import { sessionsTable } from './sessions.js'

export const usersTable = authSchema.table(
  'users',
  {
    ...withSurrogateId,
    hashedPassword: text().notNull(),
    username: citext().notNull(),
  },
  (t) => [namedUnique(t.username)],
)

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}))

export type UserEntity = Omit<typeof usersTable.$inferSelect, 'hashedPassword'>
export type UserEntityInsert = typeof usersTable.$inferInsert
