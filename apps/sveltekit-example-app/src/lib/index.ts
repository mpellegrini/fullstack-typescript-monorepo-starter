// place files you want to import through the `$lib` alias in this folder.
import { z } from 'zod'

const password = z.string().min(6).max(255)

export const schema = z
  .object({
    email: z.string().email(),
    password: password,
    password_confirm: password,
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  })
