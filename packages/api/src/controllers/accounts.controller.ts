import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { z } from 'zod'

import { lucia } from '@packages/auth-lucia'

import type { HonoTypes } from '../types/index.js'

import { createUser } from '../services/account.services.js'

const passwordSchema = z.string().min(6).max(255)

const signupSchema = z.object({
  password: passwordSchema,
  username: z.string().email(),
})

export type SignupSchema = z.infer<typeof signupSchema>

const app = new Hono<HonoTypes>()
  .basePath('/accounts')
  .get('/user', (c) => {
    const user = c.var.user
    return c.json({ user: user })
  })
  .post('/signup', zValidator('json', signupSchema), async (c) => {
    const { password, username } = c.req.valid('json')
    try {
      const userId = await createUser({ password, username })
      if (userId) {
        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        setCookie(c, sessionCookie.name, sessionCookie.value, {
          path: '.',
          ...sessionCookie.attributes,
        })
      }
      return c.json({
        message: `Verification email sent to ${username}`,
      })
    } catch (error) {
      if (error instanceof Error) {
        c.status(400)
        return c.text('E-mail already exists.')
      }
      throw error
    }
  })

export default app
