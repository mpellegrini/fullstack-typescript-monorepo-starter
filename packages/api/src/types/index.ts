import type { Session, User } from '@packages/auth-lucia'

export interface HonoTypes {
  Variables: {
    session: Session | null
    user: User | null
  }
}
