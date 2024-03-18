import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { parseEnv, z } from 'znv'

import 'dotenv/config'

const { DB_CONNECTION_STRING, DB_MAX_CONNECTIONS } = parseEnv(process.env, {
  DB_CONNECTION_STRING: z.string().url().default('postgresql://undefined'),
  DB_MAX_CONNECTIONS: z.number().min(1).default(1),
})

export const connection = postgres(DB_CONNECTION_STRING, {
  max: DB_MAX_CONNECTIONS,
  connection: {
    application_name: 'postgres.js',
  },
})

export const db = drizzle(connection)
