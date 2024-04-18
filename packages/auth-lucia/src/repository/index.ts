import { Argon2id } from 'oslo/password'

import { db } from '@packages/db-drizzlepg/client'
import { users } from '@packages/db-drizzlepg/schema'

export type NewUser = Omit<typeof users.$inferInsert, 'id' | 'hashedPassword'> & {
  password: string
}

export type User = typeof users.$inferSelect

export const findByUsername = async (username: string): Promise<User | undefined> => {
  return db.query.users.findFirst({
    columns: { id: true, username: true, hashedPassword: true },
    where: (col, { eq }) => eq(col.username, username),
  })
}

export const createUser = async (user: NewUser): Promise<string | undefined> => {
  const hashedPassword = await new Argon2id().hash(user.password)

  await db.query.users.findMany({
    with: {
      sessions: true,
    },
  })

  return db
    .insert(users)
    .values({ username: user.username, hashedPassword })
    .returning({ id: users.id })
    .then((res) => res[0]?.id)
    .catch((err) => {
      throw err
    })
}
