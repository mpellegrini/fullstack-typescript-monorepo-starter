import { HttpApi, HttpApiError } from '@effect/platform'

import { TasksContract } from './contracts/index.js'

export class PlatformApi extends HttpApi.make('api-platform') //
  .addError(HttpApiError.InternalServerError)
  .add(TasksContract.ApiGroup) {}
