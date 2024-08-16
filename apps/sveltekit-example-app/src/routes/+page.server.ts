import type { PageServerLoad } from './$types.js'

export const load = (async ({ locals }) => {
  const authedUser = await locals.getAuthedUser()
  return { authedUser }
}) satisfies PageServerLoad
