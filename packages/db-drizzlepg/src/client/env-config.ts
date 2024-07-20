import dotenv from 'dotenv'
import { z } from 'zod'

const envSchema = z.object({
  DB_CONNECTION_STRING: z.string().url(),
  // DB_CONNECTION_STRING: z.union([z.literal(''), z.string().trim().url()]),
  // DB_CONNECTION_STRING: z.string().url().or(z.literal('')),
  DB_MIN_CONNECTIONS: z.number().min(0).default(0),
  DB_MAX_CONNECTIONS: z.number().min(1).default(1),
  DB_IDLE_TIMEOUT_MILLIS: z.coerce.number().min(0).default(2_000),
  DB_LOGGING_ENABLED: z
    .string()
    .toLowerCase()
    .default('false')
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
})

export type EnvConfig = z.infer<typeof envSchema>

export const parseEnv = (): EnvConfig => {
  return envSchema.parse(dotenv.config().parsed)
}
