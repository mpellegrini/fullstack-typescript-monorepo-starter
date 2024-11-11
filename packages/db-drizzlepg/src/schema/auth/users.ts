import { relations } from 'drizzle-orm'

import { citext } from '../custom-types.js'
import { namedUnique } from '../utils.js'

import { authSchema } from './schema.js'
import sessions from './sessions.js'

const users = authSchema.table(
  'users',
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    hashedPassword: t.text().notNull(),
    username: citext().notNull(),
  }),
  (t) => [namedUnique(t.username)],
)

export default users

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export type User = typeof users.$inferSelect
