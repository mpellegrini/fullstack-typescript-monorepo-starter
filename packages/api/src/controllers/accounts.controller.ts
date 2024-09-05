import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { lucia } from '@packages/auth-lucia'

import type { CustomEnv } from '../types/index.js'

import { createUser } from '../services/account.services.js'

const passwordSchema = z.string().min(6).max(255)

const signupSchema = z.object({
  password: passwordSchema,
  username: z.string().email(),
})

export type SignupSchema = z.infer<typeof signupSchema>

const app = new Hono<CustomEnv>()
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
        console.log('**  ', session.expiresAt)
        return c.json({
          accessToken: session,
          message: `Verification email sent to ${username}`,
        })
      }
      c.status(400)
      return c.text('createUser failed')
    } catch (error) {
      if (error instanceof Error) {
        c.status(400)
        return c.text('E-mail already exists.')
      }
      throw error
    }
  })

export default app
