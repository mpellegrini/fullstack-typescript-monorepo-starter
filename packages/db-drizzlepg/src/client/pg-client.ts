import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import * as schema from '../schema/index.js'

import { parseEnv } from './env-config.js'

const {
  DB_CONNECTION_STRING,
  DB_MIN_CONNECTIONS,
  DB_MAX_CONNECTIONS,
  DB_LOGGING_ENABLED,
  DB_IDLE_TIMEOUT_MILLIS,
} = parseEnv()

export const connection = new pg.Pool({
  connectionString: DB_CONNECTION_STRING,
  /**
   * Minimum number of clients the pool should contain.
   */
  min: DB_MIN_CONNECTIONS,

  /**
   * Maximum number of clients the pool should contain.
   */
  max: DB_MAX_CONNECTIONS,

  /**
   * Number of milliseconds a client must sit idle in the pool and not
   * be checked out before it is disconnected from the backend and discarded.
   */
  idleTimeoutMillis: DB_IDLE_TIMEOUT_MILLIS,

  log: DB_LOGGING_ENABLED
    ? (messages: string): void => {
        if (messages === 'Remove idle client') console.debug(messages)
      }
    : undefined,
})

if (DB_LOGGING_ENABLED) {
  connection.on('connect', () => console.debug(`Connected`))
  connection.on('acquire', () => console.debug('Acquired a connection from the pool'))
  connection.on('release', () => console.debug('Released the connection to the pool'))
}

export const db = drizzle(connection, {
  schema,
  logger: DB_LOGGING_ENABLED,
})
