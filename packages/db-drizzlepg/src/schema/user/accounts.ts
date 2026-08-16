import { sql } from 'drizzle-orm'
import * as pg from 'drizzle-orm/pg-core'
import * as Schema from 'effect/Schema'

import { citext } from '../custom-types.ts'
import { namedUnique, withSurrogateId } from '../helpers.ts'

const AccountStatus = Schema.Literals(['active', 'inactive', 'dormant', 'closed', 'suspended'])
type AccountStatus = typeof AccountStatus.Type

export const userAccountsTable = pg.snakeCase.table(
  'user_accounts',
  {
    ...withSurrogateId,
    givenName: pg.text(),
    hashedPassword: pg.text().notNull(),
    status: pg.text().$type<AccountStatus>().notNull().default('inactive'),
    surname: pg.text(),
    username: citext().notNull(),
  },
  (t) => [
    namedUnique(t.username),
    pg.check(
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
