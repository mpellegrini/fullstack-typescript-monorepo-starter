import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import * as schema from '../schema/index.js'

import env from './env-config.js'
import { QueryLogger } from './utils.js'

const {
  DB_APPLICATION_NAME,
  DB_CONNECTION_STRING,
  DB_IDLE_TIMEOUT_MILLIS,
  DB_LOGGING_ENABLED,
  DB_MAX_CONNECTIONS,
} = env

export const connection = new pg.Pool({
  connectionString: DB_CONNECTION_STRING,

  application_name: DB_APPLICATION_NAME,

  /**
   * Maximum number of clients the pool should contain.
   * default is 10 clients.
   */
  max: DB_MAX_CONNECTIONS,

  /**
   * Number of milliseconds a client must sit idle in the pool and not
   * be checked out before it is disconnected from the backend and discarded.
   * default is 10000 ms (10 seconds) - set to 0 to disable auto-disconnection of idle clients.
   */
  idleTimeoutMillis: DB_IDLE_TIMEOUT_MILLIS,
})

if (DB_LOGGING_ENABLED) {
  connection.on('connect', () => console.debug(`Connected`))
  connection.on('acquire', () => console.debug('Acquired a connection from the pool'))
  connection.on('release', () => console.debug('Released the connection back to the pool'))
  connection.on('remove', () => console.debug('Removed the connection from the pool'))
}

export const db = drizzle(connection, {
  logger: DB_LOGGING_ENABLED ? new QueryLogger() : false,
  schema,
})
