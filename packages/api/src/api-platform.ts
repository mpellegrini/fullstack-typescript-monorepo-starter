import { HttpApi, HttpApiError } from '@effect/platform'

import { TasksContract } from './api/contracts.js'

export class PlatformApi extends HttpApi.make('api-platform') //
  .addError(HttpApiError.InternalServerError)
  .add(TasksContract.ApiGroup) {}
