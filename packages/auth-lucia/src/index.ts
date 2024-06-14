import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'
import { Argon2id } from 'oslo/password'

import { db } from '@packages/db-drizzlepg/client'
import { sessionsTable, usersTable } from '@packages/db-drizzlepg/schema'

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env['NODE_ENV'] === 'production',
    },
  },
  getUserAttributes: ({ username }) => {
    return {
      username,
    }
  },
})

export const hashPassword = async (password: string): Promise<string> => {
  return new Argon2id().hash(password)
}

export type { User, Session } from 'lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: { username: string }
  }
}
