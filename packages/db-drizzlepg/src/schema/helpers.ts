import { getTableName } from 'drizzle-orm'
import {
  type ForeignKeyBuilder,
  type IndexBuilder,
  type PgColumn,
  type UniqueConstraintBuilder,
  foreignKey,
  index,
  integer,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const namedForeignKey = (column: PgColumn, foreignColumn: PgColumn): ForeignKeyBuilder =>
  foreignKey({
    columns: [column],
    foreignColumns: [foreignColumn],
    name: `${getTableName(column.table)}_fk_${column.name}_${getTableName(foreignColumn.table)}`,
  })

export const namedUnique = (...columns: [PgColumn, ...PgColumn[]]): UniqueConstraintBuilder => {
  const tableName = getTableName(columns[0].table)
  const name = `${tableName}_uk_${columns.map((col) => col.name).join('_')}`
  return unique(name).on(...columns)
}

export const namedIndex = (...columns: [PgColumn, ...PgColumn[]]): IndexBuilder => {
  const tableName = getTableName(columns[0].table)
  const name = `${tableName}_idx_${columns.map((col) => col.name).join('_')}`
  return index(name).on(...columns)
}

export const auditMetadata = {
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true }).notNull().defaultNow(),
  updatedBy: text('updated_by').notNull(),
  version: integer('version').notNull().default(0),
}
