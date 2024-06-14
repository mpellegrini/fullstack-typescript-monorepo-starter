import { relations } from 'drizzle-orm'
import { text, uuid } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'

import { schema } from './schema.js'
import sessions from './sessions.js'

const users = schema.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: citext('username').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
})

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export default users
