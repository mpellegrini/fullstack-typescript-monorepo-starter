import { type ColumnBaseConfig, type ColumnDataType, getTableName, relations } from 'drizzle-orm'
import { foreignKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { authSchema } from './schema.js'
import users from './users.js'

import type { AnyPgColumn, ExtraConfigColumn, ForeignKeyBuilder } from 'drizzle-orm/pg-core'

export const namedForeignKey = (
  columns: [ExtraConfigColumn<ColumnBaseConfig<ColumnDataType, string>>],
  foreignColumns: [AnyPgColumn<{ tableName: string }>],
): ForeignKeyBuilder => {
  return foreignKey({
    columns: columns,
    foreignColumns: foreignColumns,
    name: `${getTableName(columns[0].table)}_fk_${getTableName(foreignColumns[0].table)}`,
  })
}

const sessions = authSchema.table(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      fk1: namedForeignKey([table.userId], [users.id]),
    }
  },
)

export type SelectSession = typeof sessions.$inferSelect
export type InsertSession = typeof sessions.$inferInsert

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export default sessions
