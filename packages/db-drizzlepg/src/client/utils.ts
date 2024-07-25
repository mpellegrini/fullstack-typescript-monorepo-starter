import type { Logger } from 'drizzle-orm'

export class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.debug('_____DRIZZLE_QUERY_____')
    console.debug(query)
    console.debug(params)
    console.debug('___END_DRIZZLE_QUERY___')
  }
}
