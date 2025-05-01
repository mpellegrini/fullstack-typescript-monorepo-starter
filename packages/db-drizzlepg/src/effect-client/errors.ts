import { Data, Match } from 'effect'
import pg from 'pg'
import { PostgresError } from 'pg-error-enum'

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly cause: pg.DatabaseError
  readonly type: 'connection_error' | 'foreign_key_violation' | 'unique_violation'
}> {
  public override toString(): string {
    return `DatabaseError: ${this.cause.message}`
  }

  public override get message(): string {
    return this.cause.message
  }
}

export class DatabaseConnectionLostError extends Data.TaggedError('DatabaseConnectionLostError')<{
  readonly cause: unknown
  readonly message: string
}> {}

export const matchPgError = (cause: unknown): DatabaseError | null =>
  cause instanceof pg.DatabaseError
    ? Match.value(cause.code).pipe(
        Match.withReturnType<DatabaseError | null>(),
        Match.when(
          PostgresError.UNIQUE_VIOLATION,
          () => new DatabaseError({ cause, type: 'unique_violation' }),
        ),
        Match.when(
          PostgresError.FOREIGN_KEY_VIOLATION,
          () => new DatabaseError({ cause, type: 'foreign_key_violation' }),
        ),
        Match.when(
          PostgresError.CONNECTION_EXCEPTION,
          () => new DatabaseError({ cause, type: 'unique_violation' }),
        ),
        Match.orElse(() => null),
      )
    : null
