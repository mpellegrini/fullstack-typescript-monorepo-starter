import { DrizzleQueryError } from 'drizzle-orm/errors'
import { Data, Match } from 'effect'
import pg from 'pg'
import { PostgresError } from 'pg-error-enum'

export class DatabaseConnectionError extends Data.TaggedError('DatabaseConnectionError')<{
  readonly cause: unknown
  readonly message: string
}> {}

type DatabaseErrorType =
  | 'connection_error'
  | 'foreign_key_violation'
  | 'unique_violation'
  | 'unknown'

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly cause: Error
  readonly params: unknown[]
  readonly query: string
  readonly type: DatabaseErrorType
}> {
  public override toString(): string {
    return `DatabaseError: ${this.cause.message}`
  }

  public override get message(): string {
    return this.cause.message
  }
}

const matchPgError = (pgDatabaseError: pg.DatabaseError): DatabaseErrorType =>
  Match.value(pgDatabaseError.code).pipe(
    Match.withReturnType<DatabaseErrorType>(),
    Match.when(PostgresError.UNIQUE_VIOLATION, () => 'unique_violation'),
    Match.when(PostgresError.FOREIGN_KEY_VIOLATION, () => 'foreign_key_violation'),
    Match.when(PostgresError.CONNECTION_EXCEPTION, () => 'connection_error'),
    Match.orElse(() => 'unknown'),
  )

export const toTaggedErrorOrThrow = (cause: unknown): DatabaseConnectionError | DatabaseError => {
  if (cause instanceof DrizzleQueryError) {
    const rootCause = cause.cause

    if (rootCause instanceof pg.DatabaseError) {
      const type = matchPgError(rootCause)
      return new DatabaseError({ cause: rootCause, params: cause.params, query: cause.query, type })
    } else if (
      rootCause instanceof AggregateError &&
      rootCause.errors.some(
        (err) => err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED',
      )
    ) {
      return new DatabaseConnectionError({
        cause: rootCause,
        message: 'Failed to connect to database',
      })
    }
  }
  throw cause
}
