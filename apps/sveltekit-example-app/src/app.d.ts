// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session, User } from '@packages/auth-lucia'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      //TODO - need to define non-lucia types for user and session
      user: User | null
      session: Session | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
