import { StatusCodes } from 'http-status-codes'

import type { AppRouteHandler } from '../../lib/types.ts'

import type { FindOneRoute } from './tasks.routes.ts'

import { wrapSingleItemResponse } from '../../lib/response-helpers.ts'

import { taskSelectSchema } from './tasks.schema.ts'

export const findOne: AppRouteHandler<FindOneRoute> = (ctx) => {
  const { id } = ctx.req.valid('param')

  const foundUser = {
    id,
    done: false,
    name: 'My Found Task',
  }

  return ctx.json(wrapSingleItemResponse(taskSelectSchema, foundUser, ctx), StatusCodes.OK)
}
