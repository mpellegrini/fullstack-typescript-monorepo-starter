import type { SelectResultFields } from 'drizzle-orm/query-builders/select.types'

import { type SQL, type SQLChunk, and, is, sql } from 'drizzle-orm'
import { type SelectedFields, PgTimestamp, PgTimestampString } from 'drizzle-orm/pg-core'

const buildSqlChunksFrom = <T extends SelectedFields>(selectedFields: T): SQLChunk[] => {
  const chunks: SQLChunk[] = []
  for (const [key, value] of Object.entries(selectedFields)) {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`, `))
    }
    chunks.push(sql.raw(`'${key}',`))
    if (is(value, PgTimestampString) || is(value, PgTimestamp)) {
      // TODO: Verify correct timezone representation
      chunks.push(sql`to_char
        (${value}, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')`)
    } else {
      chunks.push(sql`${value}`)
    }
  }
  return chunks
}

export const jsonBuildObject = <T extends SelectedFields>(
  selectedFields: T,
): SQL<SelectResultFields<T>> => {
  const chunks: SQLChunk[] = buildSqlChunksFrom(selectedFields)
  return sql<SelectResultFields<T>>`json_build_object
    (${sql.join(chunks)})`
}

export const jsonbBuildObject = <T extends SelectedFields>(
  selectedFields: T,
): SQL<SelectResultFields<T>> => {
  const chunks: SQLChunk[] = buildSqlChunksFrom(selectedFields)
  return sql<SelectResultFields<T>>`jsonb_build_object
    (${sql.join(chunks)})`
}

export const jsonAggBuildObject = <T extends SelectedFields>(
  shape: T,
  options?: { orderBy?: { column: T[keyof T]; direction: 'asc' | 'desc' }[] },
): SQL<SelectResultFields<T>[]> => {
  const orderClauses =
    options?.orderBy?.map(({ column, direction }) => sql`${column} ${sql.raw(direction)}`) ?? []

  const orderByClause =
    orderClauses.length > 0 ? sql` ORDER BY ${sql.join(orderClauses, sql`, `)}` : sql``

  const filterClause = sql`FILTER (WHERE ${and(
    sql.join(
      Object.values(shape).map((value) => sql`${sql`${value}`} IS NOT NULL`),
      sql` AND `,
    ),
  )})`

  return sql<
    SelectResultFields<T>[]
  >`coalesce(json_agg(${jsonBuildObject(shape)} ${orderByClause}) ${filterClause}, '${sql`[]`}')`
}
