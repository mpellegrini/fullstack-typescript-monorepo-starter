import { HttpApiSchema } from '@effect/platform'
import { Schema } from 'effect'
import status from 'http-status'

/**
 * 4xx Client Errors
 */
export class BadRequest extends Schema.TaggedError<BadRequest>('BadRequest')(
  'BadRequest',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: status['400_MESSAGE'],
    status: status.BAD_REQUEST,
  }),
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>('Unauthorized')(
  'Unauthorized',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: status['401_MESSAGE'],
    status: status.UNAUTHORIZED,
  }),
) {}

export class NotFound extends Schema.TaggedError<NotFound>('NotFound')(
  'NotFound',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: status['404_MESSAGE'],
    status: status.NOT_FOUND,
  }),
) {}

/**
 * 5xx Client Errors
 */
export class InternalServerError extends Schema.TaggedError<InternalServerError>(
  'InternalServerError',
)(
  'InternalServerError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: status['500_MESSAGE'],
    status: status.INTERNAL_SERVER_ERROR,
  }),
) {}
