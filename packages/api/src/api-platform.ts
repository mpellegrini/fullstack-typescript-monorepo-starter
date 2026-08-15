import { HttpApi } from '@effect/platform'

import { BuildInfoContract, TasksContract } from './contracts/index.ts'
import * as CustomHttpApiError from './custom-httpapi-error.ts'

export class PlatformApi extends HttpApi.make('api-platform') //
  .addError(CustomHttpApiError.InternalServerError)
  .add(TasksContract.ApiGroup)
  .add(BuildInfoContract.ApiGroup) {}
