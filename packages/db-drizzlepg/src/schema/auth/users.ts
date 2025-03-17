import { text } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'
import { namedUnique, withSurrogateId } from '../helpers.js'

import { authSchema } from './schema.js'

export const usersTable = authSchema.table(
  'users',
  {
    ...withSurrogateId,
    hashedPassword: text().notNull(),
    username: citext().notNull(),
  },
  (t) => [namedUnique(t.username)],
)

export type UserEntity = Omit<typeof usersTable.$inferSelect, 'hashedPassword'>
export type UserEntityInsert = typeof usersTable.$inferInsert
