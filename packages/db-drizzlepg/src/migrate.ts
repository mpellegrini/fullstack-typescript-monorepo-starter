import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { connection, db } from './client/pg-client.js'

try {
  console.log('Drizzle database migration starting...')

  await migrate(db, {
    migrationsFolder: './drizzle',
  })

  console.log('Drizzle database migration completed successfully!')
} catch (error) {
  console.log('Drizzle database migrations failed!', error)
} finally {
  await connection.end()
}
