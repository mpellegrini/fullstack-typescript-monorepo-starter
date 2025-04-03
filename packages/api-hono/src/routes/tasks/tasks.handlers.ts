import { StatusCodes } from 'http-status-codes'

import type { AppRouteHandler } from '../../lib/types.js'

import type { FindOneRoute } from './tasks.routes.js'

export const findOne: AppRouteHandler<FindOneRoute> = (ctx) => {
  const { id } = ctx.req.valid('param')

  const foundUser = {
    id,
    done: false,
    name: 'My Found Task',
  }

  return ctx.json(foundUser, StatusCodes.OK)
}
