import * as pg from 'drizzle-orm/pg-core'

export const citext = pg.customType<{ data: string }>({
  dataType: () => 'citext',
  // Explicitly mapping values prevents driver-level type casting errors
  fromDriver: String,
  toDriver: (value: string): string => value,
})
