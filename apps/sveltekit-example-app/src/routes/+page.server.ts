import type { User } from '@packages/example-pkg'

import type { PageServerLoad } from './$types'

export const load = (({ locals }): { user: User } => ({
  user: {
    email: 'bob@loblaw.com',
    first_name: locals.user?.username ?? 'Bob',
    is_admin: true,
    last_name: 'Loblaw',
  },
})) satisfies PageServerLoad
