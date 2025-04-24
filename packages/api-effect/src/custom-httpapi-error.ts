import { HttpApiSchema } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'

/**
 * 4xx Client Errors
 */
export class BadRequest extends Schema.TaggedError<BadRequest>('BadRequest')(
  'BadRequest',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: 'The request was invalid or cannot be otherwise served',
    status: StatusCodes.BAD_REQUEST,
  }),
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>('Unauthorized')(
  'Unauthorized',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: 'Authentication is required and has failed or has not been provided',
    status: StatusCodes.UNAUTHORIZED,
  }),
) {}

export class NotFound extends Schema.TaggedError<NotFound>('NotFound')(
  'NotFound',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    description: 'The requested resource could not be found',
    status: StatusCodes.NOT_FOUND,
  }),
) {}
