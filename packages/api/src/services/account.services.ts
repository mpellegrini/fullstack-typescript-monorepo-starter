import { Argon2id } from 'oslo/password'

import { db } from '@packages/db-drizzlepg/client'
import { type User, usersTable } from '@packages/db-drizzlepg/schema'

export type NewUser = Omit<User, 'hashedPassword' | 'id'> & {
  password: string
}

export const findByUsername = async (username: string): Promise<User | undefined> =>
  db.query.usersTable.findFirst({
    columns: { id: true, hashedPassword: true, username: true },
    where: (col, { eq }) => eq(col.username, username),
  })

export const createUser = async (user: NewUser): Promise<string | undefined> => {
  const hashedPassword = await new Argon2id().hash(user.password)

  return db
    .insert(usersTable)
    .values({ hashedPassword, username: user.username })
    .returning({ id: usersTable.id })
    .then((resp) => resp[0]?.id)
    .catch((error) => {
      throw error
    })
}
