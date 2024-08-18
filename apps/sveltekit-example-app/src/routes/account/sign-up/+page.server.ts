import { StatusCodes } from 'http-status-codes'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { signupSchema } from '$lib/schemas'

import type { Actions, PageServerLoad } from './$types.js'

export const load = (async () => {
  const form = await superValidate(zod(signupSchema))
  return { form }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ locals: { api }, request }) => {
    const form = await superValidate(request, zod(signupSchema))
    if (!form.valid) return fail(StatusCodes.BAD_REQUEST, { form })

    const resp = await api.accounts.signup.$post({
      json: {
        password: form.data.password,
        username: form.data.username,
      },
    })

    return resp.ok
      ? message(form, await resp.json())
      : setError(form, 'username', await resp.text())
  },
} satisfies Actions
