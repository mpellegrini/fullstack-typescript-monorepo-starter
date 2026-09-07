import { EffectDrizzleQueryError } from 'drizzle-orm/effect-core/errors'
import * as Cause from 'effect/Cause'
import * as Data from 'effect/Data'
import * as Match from 'effect/Match'
import * as SqlError from 'effect/unstable/sql/SqlError'
import { PostgresError } from 'pg-error-enum'

export class DatabaseConnectionError extends Data.TaggedError('DatabaseConnectionError')<{
  readonly cause: unknown
  readonly message: string
}> {}

type DatabaseErrorType =
  'connection_error' | 'foreign_key_violation' | 'unique_violation' | 'unknown'

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

/**
 * `@effect/sql-pg` already classifies PostgreSQL error codes into a
 * `SqlErrorReason`, so only the cases it does not distinguish (foreign key vs.
 * other integrity violations) need the raw `pg` error code.
 */
const pgCodeOf = (cause: unknown): string | undefined => {
  if (typeof cause !== 'object' || cause === null || !('code' in cause)) {
    return undefined
  }
  const { code } = cause
  return typeof code === 'string' ? code : undefined
}

const matchSqlErrorReason = (reason: SqlError.SqlErrorReason): DatabaseErrorType =>
  Match.value(reason).pipe(
    Match.withReturnType<DatabaseErrorType>(),
    Match.tag('UniqueViolation', () => 'unique_violation'),
    Match.tag('ConstraintError', ({ cause }) =>
      pgCodeOf(cause) === PostgresError.FOREIGN_KEY_VIOLATION ? 'foreign_key_violation' : 'unknown',
    ),
    Match.tag('ConnectionError', () => 'connection_error'),
    Match.orElse(() => 'unknown'),
  )

/**
 * Drizzle's Effect session wraps the underlying failure in a `Cause` before
 * attaching it to `EffectDrizzleQueryError.cause`, so it has to be squashed
 * back out to reach the `SqlError`.
 */
const sqlErrorOf = (cause: unknown): SqlError.SqlError | undefined => {
  const squashed = Cause.isCause(cause) ? Cause.squash(cause) : cause
  return SqlError.isSqlError(squashed) ? squashed : undefined
}

/**
 * Maps the errors surfaced by the Effect Drizzle driver onto this package's
 * tagged errors. Query errors arrive as `EffectDrizzleQueryError` (carrying the
 * SQL and params); connection and client-level failures arrive as `SqlError`.
 */
export const toDatabaseError = (
  error: EffectDrizzleQueryError | SqlError.SqlError,
): DatabaseConnectionError | DatabaseError => {
  const isQueryError = error instanceof EffectDrizzleQueryError
  const params = isQueryError ? error.params : []
  const query = isQueryError ? error.query : ''
  const sqlError = isQueryError ? sqlErrorOf(error.cause) : error

  if (sqlError === undefined) {
    return new DatabaseError({ cause: error, params, query, type: 'unknown' })
  }

  const type = matchSqlErrorReason(sqlError.cause)

  if (type === 'connection_error') {
    return new DatabaseConnectionError({
      cause: sqlError.cause.cause,
      message: 'Failed to connect to database',
    })
  }

  return new DatabaseError({ cause: sqlError.cause, params, query, type })
}
