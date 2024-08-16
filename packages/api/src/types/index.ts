import type { Session, User } from '@packages/auth-lucia'

export interface HonoVariables {
  Variables: {
    session: Session | null
    user: User | null
  }
}
