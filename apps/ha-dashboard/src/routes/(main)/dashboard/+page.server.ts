import { getEntities } from '$lib/server/ha-connection'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => ({
  entities: getEntities(),
})
