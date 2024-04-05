import { Argon2id } from 'oslo/password'

import { db } from '@packages/drizzledb-pg/client'
import * as schema from '@packages/drizzledb-pg/schema'
import { users } from '@packages/drizzledb-pg/schema'

export type NewUser = Omit<typeof schema.users.$inferInsert, 'id' | 'hashedPassword'> & {
  password: string
}

export type User = typeof schema.users.$inferSelect

export const createUser = async (user: NewUser): Promise<string | undefined> => {
  const hashedPassword = await new Argon2id().hash(user.password)
  return db
    .insert(schema.users)
    .values({ username: user.username, hashedPassword })
    .returning({ id: users.id })
    .then((res) => res[0]?.id)
    .catch((err) => {
      throw err
    })
}
