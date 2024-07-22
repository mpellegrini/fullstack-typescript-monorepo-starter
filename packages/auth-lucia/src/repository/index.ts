import { Argon2id } from 'oslo/password'

import { db } from '@packages/db-drizzlepg/client'
import { type User, usersTable } from '@packages/db-drizzlepg/schema'

export type NewUser = Omit<User, 'id' | 'hashedPassword'> & {
  password: string
}

export const findByUsername = async (username: string): Promise<User | undefined> => {
  return db.query.usersTable.findFirst({
    columns: { id: true, username: true, hashedPassword: true },
    where: (col, { eq }) => eq(col.username, username),
  })
}

export const createUser = async (user: NewUser): Promise<string | undefined> => {
  const hashedPassword = await new Argon2id().hash(user.password)

  return db
    .insert(usersTable)
    .values({ username: user.username, hashedPassword })
    .returning({ id: usersTable.id })
    .then((res) => res[0]?.id)
    .catch((err) => {
      throw err
    })
}
