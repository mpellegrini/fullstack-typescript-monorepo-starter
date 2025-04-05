import { StatusCodes } from 'http-status-codes'

import type { AppRouteHandler } from '../../lib/types.js'

import type { FindOneRoute } from './tasks.routes.js'

import { wrapSingleItemResponse } from '../../lib/response-helpers.js'

import { taskSelectSchema } from './tasks.schema.js'

export const findOne: AppRouteHandler<FindOneRoute> = (ctx) => {
  const { id } = ctx.req.valid('param')

  const foundUser = {
    id,
    done: false,
    name: 'My Found Task',
  }

  return ctx.json(wrapSingleItemResponse(taskSelectSchema, foundUser, ctx), StatusCodes.OK)
}
