import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { connection, db } from './client/nodepostres-client.js'

try {
  console.log('Drizzle database migration starting...')

  await migrate(db, {
    migrationsFolder: './drizzle',
  })

  console.log('Drizzle database migration completed successfully!')
} catch (err) {
  console.log('Drizzle database migrations failed!', err)
} finally {
  await connection.end()
}
