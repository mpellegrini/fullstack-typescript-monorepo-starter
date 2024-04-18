import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { parseEnv, z } from 'znv'

import * as schema from '../schema/index.js'

import 'dotenv/config'

const { DB_CONNECTION_STRING, DB_MAX_CONNECTIONS } = parseEnv(process.env, {
  DB_CONNECTION_STRING: z.string().url().default('postgresql://undefined'),
  DB_MAX_CONNECTIONS: z.number().min(1).default(1),
})

export const connection = new pg.Pool({
  connectionString: DB_CONNECTION_STRING,
  /**
   * Minimum number of clients the pool should contain.
   */
  min: 0,

  /**
   * Maximum number of clients the pool should contain.
   */
  max: DB_MAX_CONNECTIONS,

  /**
   * Number of milliseconds a client must sit idle in the pool and not
   * be checked out before it is disconnected from the backend and discarded.
   */
  idleTimeoutMillis: 2_000,

  log: (messages) => console.log(messages),
})

connection.on('connect', () => console.log(`Connected`))
connection.on('acquire', () => console.log('acquired a connection from the pool'))
connection.on('release', () => console.log('released the connection to the pool'))

export const db = drizzle(connection, { schema })
