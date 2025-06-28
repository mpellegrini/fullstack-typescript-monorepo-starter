import { sql } from 'drizzle-orm'
import { check, pgTable, text } from 'drizzle-orm/pg-core'
import { Schema } from 'effect'

import { citext } from '../custom-types.js'
import { namedUnique, withSurrogateId } from '../helpers.js'

const AccountStatus = Schema.Literal('active', 'inactive', 'dormant', 'closed', 'suspended')
type AccountStatus = typeof AccountStatus.Type

export const userAccountsTable = pgTable(
  'user_accounts',
  {
    ...withSurrogateId,
    givenName: text(),
    hashedPassword: text().notNull(),
    status: text().$type<AccountStatus>().notNull().default('inactive'),
    surname: text(),
    username: citext().notNull(),
  },
  (t) => [
    namedUnique(t.username),
    check(
      'user_accounts_chk_status',
      sql`${t.status} in ${sql.raw(`('${AccountStatus.literals.join("','")}')`)}`,
    ),
  ],
)

export type UserAccountEntity = Omit<typeof userAccountsTable.$inferSelect, 'hashedPassword'>
export type NewUserAccountEntity = Omit<
  typeof userAccountsTable.$inferSelect,
  'hashedPassword' | 'status'
> & {
  password: string
}
