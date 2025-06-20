import { Data } from 'effect'

export class DatabaseConnectionError extends Data.TaggedError('DatabaseConnectionError')<{
  readonly cause: unknown
  readonly message: string
}> {}
