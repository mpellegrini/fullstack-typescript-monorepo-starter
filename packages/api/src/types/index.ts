import type { Env } from 'hono/types'

import type { Session, User } from '@packages/auth-lucia'

export type CustomEnv = Omit<Env, 'Bindings'> & {
  Variables: {
    session: Session | null
    user: User | null
  }
}
