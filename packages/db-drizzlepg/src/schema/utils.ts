import type { ForeignKeyBuilder, PgColumn, UniqueConstraintBuilder } from 'drizzle-orm/pg-core'

import { getTableName } from 'drizzle-orm'
import { foreignKey, unique } from 'drizzle-orm/pg-core'

export const namedForeignKey = (column: PgColumn, foreignColumn: PgColumn): ForeignKeyBuilder => {
  return foreignKey({
    columns: [column],
    foreignColumns: [foreignColumn],
    name: `${getTableName(column.table)}_fk_${column.name}_${getTableName(foreignColumn.table)}`,
  })
}

export const namedUnique = (...columns: [PgColumn, ...PgColumn[]]): UniqueConstraintBuilder => {
  const tableName = getTableName(columns[0].table)
  const name = `${tableName}_uk_${columns.map((col) => col.name).join('_')}`
  return unique(name).on(...columns)
}
