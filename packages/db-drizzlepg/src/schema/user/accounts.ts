import { sql } from 'drizzle-orm'
import { check, pgTable, text } from 'drizzle-orm/pg-core'

import { citext } from '../custom-types.js'
import { namedUnique, withSurrogateId } from '../helpers.js'

const accountStatus = ['active', 'inactive', 'dormant', 'closed', 'suspended'] as const
type AccountStatus = (typeof accountStatus)[number]

export const userAccountsTable = pgTable(
  'user_accounts',
  {
    ...withSurrogateId,
    firstName: text(),
    hashedPassword: text().notNull(),
    lastName: text(),
    status: text().$type<AccountStatus>().notNull().default('inactive'),
    username: citext().notNull(),
  },
  (t) => [
    namedUnique(t.username),
    check(
      'user_accounts_chk_status',
      sql`${t.status} in ${sql.raw(`'${accountStatus.join("','")}'`)}`,
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
