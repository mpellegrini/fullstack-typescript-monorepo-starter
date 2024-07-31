// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session, User } from '@packages/auth-lucia'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: Session | null
      user: User | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
