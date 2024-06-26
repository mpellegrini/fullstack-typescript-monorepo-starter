import { fail } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { signupSchema } from '$lib'
import { lucia } from '@packages/auth-lucia'
import { createUser } from '@packages/auth-lucia/repository'

import type { Actions, PageServerLoad } from './$types.js'

export const load = (async () => {
  const form = await superValidate({ email: '' }, zod(signupSchema))
  return { form }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(signupSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    try {
      const userId = await createUser({ username: form.data.email, password: form.data.password })
      if (userId) {
        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies.set(sessionCookie.name, sessionCookie.value, {
          path: '.',
          ...sessionCookie.attributes,
        })
        return message(form, 'Form posted successfully!')
      } else {
        return message(form, 'User was not returned!')
      }
    } catch (err) {
      if (err instanceof Error) {
        return setError(form, 'email', 'E-mail already exists.')
      }
      throw err
    }
  },
} satisfies Actions
