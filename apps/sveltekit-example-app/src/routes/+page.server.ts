import type { PageServerLoad } from './$types'
import type { User } from '@packages/example-pkg'

export const load = (({ locals }): { user: User } => {
  return {
    user: {
      first_name: locals.user?.username ?? 'Bob',
      last_name: 'Loblaw',
      email: 'bob@loblaw.com',
      is_admin: true,
    },
  }
}) satisfies PageServerLoad
