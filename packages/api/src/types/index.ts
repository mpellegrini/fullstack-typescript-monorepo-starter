import type { Env } from 'hono/types'

export type Session = string
export type User = string

export type CustomEnv = Omit<Env, 'Bindings'> & {
  Variables: {
    session: Session | null
    user: User | null
  }
}
