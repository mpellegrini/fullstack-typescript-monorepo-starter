import type { PageServerLoad } from './$types'
import type { User } from '@packages/example-pkg'

export const load = (({ locals }): { user: User } => {
  return {
    user: {
      email: 'bob@loblaw.com',
      first_name: locals.user?.username ?? 'Bob',
      is_admin: true,
      last_name: 'Loblaw',
    },
  }
}) satisfies PageServerLoad
