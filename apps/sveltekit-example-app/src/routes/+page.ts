import type { PageLoad } from './$types'
import type { User } from '@packages/example-pkg'

export const load = ((): { user: User } => {
  return {
    user: {
      first_name: 'Bob',
      last_name: 'Loblaw',
      email: 'bob@loblaw.com',
      is_admin: true,
    },
  }
}) satisfies PageLoad
