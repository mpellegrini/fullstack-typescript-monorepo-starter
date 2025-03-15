// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { ApiClient } from '@packages/api/client'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      api: ApiClient['api']
      getAuthedUser: () => Promise<string | null>
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
