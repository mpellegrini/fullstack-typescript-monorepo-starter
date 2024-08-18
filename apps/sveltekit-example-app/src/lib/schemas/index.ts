import { z } from 'zod'

const password = z.string().min(6).max(255)

export const signupSchema = z
  .object({
    password: password,
    password_confirm: password,
    username: z.string().email(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  })

export type SignUpForm = z.infer<typeof signupSchema>
