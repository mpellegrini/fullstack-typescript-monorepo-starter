import type { Logger } from 'drizzle-orm'

import { format } from 'sql-formatter'

export class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.debug('_____DRIZZLE_QUERY_____')
    console.debug(
      format(query, {
        language: 'postgresql',
        params: Object.fromEntries(
          params.map((value, index) => [
            index + 1,
            typeof value === 'string' ? `'${value}'` : String(value),
          ]),
        ),
      }),
    )
    console.debug('___END_DRIZZLE_QUERY___')
  }
}
