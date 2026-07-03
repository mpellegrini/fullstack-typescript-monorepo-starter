import { HttpApi } from '@effect/platform'

import { BuildInfoContract, TasksContract } from './contracts/index.js'
import * as CustomHttpApiError from './custom-httpapi-error.js'

export class PlatformApi extends HttpApi.make('api-platform') //
  .addError(CustomHttpApiError.InternalServerError)
  .add(TasksContract.ApiGroup)
  .add(BuildInfoContract.ApiGroup) {}
