import { relations } from 'drizzle-orm'
import { text, unique, uuid } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'

import { authSchema } from './schema.js'
import sessions from './sessions.js'

const users = authSchema.table(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: citext('username').notNull(),
    hashedPassword: text('hashed_password').notNull(),
  },
  (table) => {
    return {
      uk1: unique('users_uk_username').on(table.username),
    }
  },
)

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export default users
