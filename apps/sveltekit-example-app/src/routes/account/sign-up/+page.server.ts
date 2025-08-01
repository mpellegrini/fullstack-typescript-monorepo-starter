import { StatusCodes } from 'http-status-codes'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { effect } from 'sveltekit-superforms/adapters'

import { SignUpFormSchema } from '$lib/schemas'

import type { Actions, PageServerLoad } from './$types.js'

export const load = (async () => {
  const form = await superValidate(effect(SignUpFormSchema))
  return { form }
}) satisfies PageServerLoad

export const actions = {
  //   default: async ({ cookies, locals: { api }, request }) => {
  default: async ({ request }) => {
    const form = await superValidate(request, effect(SignUpFormSchema))
    if (!form.valid) return fail(StatusCodes.BAD_REQUEST, { form })

    /*
    const resp = await api.accounts.signup.$post({
      json: {
        password: form.data.password,
        username: form.data.username,
      },
    })

    if (resp.ok) {
      const result = await resp.json()
      cookies.set('auth_session', 'result.accessToken.id', {
        httpOnly: true,
        maxAge: 7200,
        path: '/',
        sameSite: 'lax',
        secure: false,
      })
      return message(form, result.message)
    } else {
      return setError(form, 'username', await resp.text())
    }
    */
    return message(form, 'Signup Completed')
  },
} satisfies Actions
