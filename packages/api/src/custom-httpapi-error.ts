import { Schema } from 'effect'
import status from 'http-status'

/**
 * 4xx Client Errors
 */
export class BadRequest extends Schema.TaggedError<BadRequest>()(
  'BadRequest',
  {
    message: Schema.optional(Schema.String),
  },
  {
    description: status['400_MESSAGE'],
    httpApiStatus: status.BAD_REQUEST,
  },
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  'Unauthorized',
  {
    message: Schema.optional(Schema.String),
  },
  {
    description: status['401_MESSAGE'],
    httpApiStatus: status.UNAUTHORIZED,
  },
) {}

export class NotFound extends Schema.TaggedError<NotFound>()(
  'NotFound',
  {
    message: Schema.optional(Schema.String),
  },
  {
    description: status['404_MESSAGE'],
    httpApiStatus: status.NOT_FOUND,
  },
) {}

/**
 * 5xx Client Errors
 */
export class InternalServerError extends Schema.TaggedError<InternalServerError>()(
  'InternalServerError',
  {
    message: Schema.optional(Schema.String),
  },
  {
    description: status['500_MESSAGE'],
    httpApiStatus: status.INTERNAL_SERVER_ERROR,
  },
) {}
