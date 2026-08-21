import { type Table, getColumnTable, getTableName, sql } from 'drizzle-orm'
import * as pg from 'drizzle-orm/pg-core'

export const namedForeignKey = (
  column: pg.PgColumn,
  foreignColumn: pg.PgColumn,
): pg.ForeignKeyBuilder =>
  pg.foreignKey({
    columns: [column],
    foreignColumns: [foreignColumn],
    name: `${getTableName(getColumnTable<Table>(column))}_fk_${column.name}_${getTableName(getColumnTable<Table>(foreignColumn))}`,
  })

export const namedUnique = (
  ...columns: [pg.PgColumn, ...pg.PgColumn[]]
): pg.UniqueConstraintBuilder => {
  const tableName = getTableName(getColumnTable<Table>(columns[0]))
  const name = `${tableName}_uk_${columns.map((col) => col.name).join('_')}`
  return pg.unique(name).on(...columns)
}

export const namedIndex = (...columns: [pg.PgColumn, ...pg.PgColumn[]]): pg.IndexBuilder => {
  const tableName = getTableName(getColumnTable<Table>(columns[0]))
  const name = `${tableName}_idx_${columns.map((col) => col.name).join('_')}`
  return pg.index(name).on(...columns)
}

export const namedEnumCheck = (
  column: pg.PgColumn,
  literals: readonly [string, ...string[]],
): pg.CheckBuilder => {
  const tableName = getTableName(getColumnTable<Table>(column))
  return pg.check(
    `${tableName}_chk_${column.name}`,
    sql`${column} in ${sql.raw(`('${literals.join("','")}')`)}`,
  )
}

export const withSurrogateId = {
  id: pg
    .uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
}

export const withAuditMetadata = {
  createdAt: pg.timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
  createdBy: pg.text().notNull(),
  updatedAt: pg.timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
  updatedBy: pg.text().notNull(),
  version: pg.integer().notNull().default(0),
}
