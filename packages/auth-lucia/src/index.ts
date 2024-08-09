import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'
import { Argon2id } from 'oslo/password'

import { db } from '@packages/db-drizzlepg/client'
import { sessionsTable, usersTable } from '@packages/db-drizzlepg/schema'

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable)

export const lucia = new Lucia(adapter, {
  getUserAttributes: ({ username }) => ({
    username,
  }),
  sessionCookie: {
    attributes: {
      secure: process.env['NODE_ENV'] === 'production',
    },
  },
})

export const hashPassword = async (password: string): Promise<string> =>
  new Argon2id().hash(password)

export type { Session, User } from 'lucia'

declare module 'lucia' {
  interface Register {
    DatabaseUserAttributes: { username: string }
    Lucia: typeof lucia
  }
}
