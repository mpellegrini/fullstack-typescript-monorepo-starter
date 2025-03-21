import { hash } from '@node-rs/argon2'

import { db } from '@packages/db-drizzlepg/client'
import {
  type NewUserAccountEntity,
  type UserAccountEntity,
  userAccountsTable,
} from '@packages/db-drizzlepg/schema'

export const findByUsername = async (username: string): Promise<UserAccountEntity | undefined> =>
  db.query.userAccountsTable.findFirst({
    columns: {
      id: true,
      firstName: true,
      hashedPassword: true,
      lastName: true,
      status: true,
      username: true,
    },
    where: { username },
  })

export const createUser = async (user: NewUserAccountEntity): Promise<string | undefined> => {
  const hashedPassword = await hash(user.password)

  return db
    .insert(userAccountsTable)
    .values({ hashedPassword, username: user.username })
    .returning({ id: userAccountsTable.id })
    .then((resp) => resp[0]?.id)
    .catch((error) => {
      throw error
    })
}
