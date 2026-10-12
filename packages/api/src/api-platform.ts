import { HttpApi } from 'effect/http-api'

import { BuildInfoContract, TasksContract } from './contracts/index.ts'

export class PlatformApi extends HttpApi.make('api-platform') //
  .add(TasksContract.ApiGroup)
  .add(BuildInfoContract.ApiGroup) {}
