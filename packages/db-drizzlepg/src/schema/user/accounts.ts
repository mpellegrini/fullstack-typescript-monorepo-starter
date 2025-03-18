import { text } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'
import { namedUnique, withSurrogateId } from '../helpers.js'

import { userSchema } from './schema.js'

export const userAccountsTable = userSchema.table(
  'users',
  {
    ...withSurrogateId,
    hashedPassword: text().notNull(),
    username: citext().notNull(),
  },
  (t) => [namedUnique(t.username)],
)

export type UserEntity = Omit<typeof userAccountsTable.$inferSelect, 'hashedPassword'>
export type UserEntityInsert = typeof userAccountsTable.$inferInsert
