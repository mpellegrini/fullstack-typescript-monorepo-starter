import { config as dotenvConfig } from 'dotenv'
import * as process from 'node:process'
import { type ZodDefault, z } from 'zod'

const withDevDefault = <T extends z.ZodType>(
  schema: T,
  defaultDevValue: Exclude<z.output<T>, undefined>,
): T | ZodDefault<T> =>
  process.env['NODE_ENV'] === 'production' ? schema : schema.default(defaultDevValue)

const envSchema = z.object({
  NODE_ENV: withDevDefault(z.enum(['development', 'production']), 'development'),
  NODE_PORT: withDevDefault(z.coerce.number().min(1024).max(65_535), 3000),
})

export type Env = z.infer<typeof envSchema>

dotenvConfig()

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(z.treeifyError(parsedEnv.error), null, 2)}`,
  )
}

const env: Env = parsedEnv.data

export default env
