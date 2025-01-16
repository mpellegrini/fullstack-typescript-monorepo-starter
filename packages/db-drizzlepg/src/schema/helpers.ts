import { getTableName } from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'
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

/*
  Note: In the below functions, when getting the column name, the non snake-case name is
        returned (websiteUrl vs website_url). There is an open issue on this, so workaround
        for now is to use the toSnakeCase function that Drizzle uses.
        see: https://github.com/drizzle-team/drizzle-orm/issues/3094
 */

export const namedForeignKey = (column: PgColumn, foreignColumn: PgColumn): ForeignKeyBuilder =>
  foreignKey({
    columns: [column],
    foreignColumns: [foreignColumn],
    name: `${getTableName(column.table)}_fk_${toSnakeCase(column.name)}_${getTableName(foreignColumn.table)}`,
  })

export const namedUnique = (...columns: [PgColumn, ...PgColumn[]]): UniqueConstraintBuilder => {
  const tableName = getTableName(columns[0].table)
  const name = `${tableName}_uk_${columns.map((col) => toSnakeCase(col.name)).join('_')}`
  return unique(name).on(...columns)
}

export const namedIndex = (...columns: [PgColumn, ...PgColumn[]]): IndexBuilder => {
  const tableName = getTableName(columns[0].table)
  const name = `${tableName}_idx_${columns.map((col) => toSnakeCase(col.name)).join('_')}`
  return index(name).on(...columns)
}

export const auditMetadata = {
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true }).notNull().defaultNow(),
  updatedBy: text('updated_by').notNull(),
  version: integer('version').notNull().default(0),
}
