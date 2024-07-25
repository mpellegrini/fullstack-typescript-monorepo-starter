import dotenv from 'dotenv'
import { z } from 'zod'

const envSchema = z.object({
  DB_CONNECTION_STRING: z.string().url(),
  DB_MAX_CONNECTIONS: z.coerce.number().min(1).default(10),
  DB_IDLE_TIMEOUT_MILLIS: z.coerce.number().min(0).default(10_000),
  DB_APPLICATION_NAME: z.string().default('node-postgres-pool'),
  DB_LOGGING_ENABLED: z
    .string()
    .toLowerCase()
    .default('false')
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
})

export default envSchema.parse(dotenv.config().parsed)
