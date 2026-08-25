import { HttpApi } from 'effect/unstable/httpapi'

import { BuildInfoContract, TasksContract } from './contracts/index.ts'

export class PlatformApi extends HttpApi.make('api-platform') //
  .add(TasksContract.ApiGroup)
  .add(BuildInfoContract.ApiGroup) {}
