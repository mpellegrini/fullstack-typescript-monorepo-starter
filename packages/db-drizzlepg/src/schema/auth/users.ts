import { relations } from 'drizzle-orm'
import { text, uuid } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'
import { namedUnique } from '../utils.js'

import { authSchema } from './schema.js'
import sessions from './sessions.js'

const users = authSchema.table(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    hashedPassword: text('hashed_password').notNull(),
    username: citext('username').notNull(),
  },
  (table) => ({
    uk1: namedUnique(table.username),
  }),
)

export default users

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export type User = typeof users.$inferSelect
