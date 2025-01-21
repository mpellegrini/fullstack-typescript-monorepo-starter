import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { db } from './client/index.js'

try {
  console.log('Drizzle database migration starting...')

  await migrate(db, {
    migrationsFolder: './src/migrations',
  })

  console.log('Drizzle database migration completed successfully!')
} catch (error) {
  console.log('Drizzle database migrations failed!', error)
} finally {
  await db.$client.end()
}
