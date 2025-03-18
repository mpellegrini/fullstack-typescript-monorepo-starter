import { hash } from '@node-rs/argon2'

import { db } from '@packages/db-drizzlepg/client'
import {
  type UserEntity,
  type UserEntityInsert,
  userAccountsTable,
} from '@packages/db-drizzlepg/schema'

export type NewUser = Omit<UserEntityInsert, 'hashedPassword'> & {
  password: string
}

export const findByUsername = async (username: string): Promise<UserEntity | undefined> =>
  db.query.userAccountsTable.findFirst({
    columns: { id: true, hashedPassword: true, username: true },
    where: { username },
  })

export const createUser = async (user: NewUser): Promise<string | undefined> => {
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
