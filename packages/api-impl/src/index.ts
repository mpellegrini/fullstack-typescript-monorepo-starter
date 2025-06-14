import { HttpApiBuilder } from '@effect/platform'
import { Layer } from 'effect'

import { Api } from '@packages/api'
import { Database } from '@packages/db-drizzlepg/effect-client'

import { DatabaseLive } from './services/index.js'
import { taskGroupLive } from './tasks-live.js'

export const ApiLive = HttpApiBuilder
  //
  .api(Api)

  .pipe(
    Layer.merge(Layer.effectDiscard(Database.Database.use((db) => db.setupConnectionListeners))),
    Layer.provide(DatabaseLive),
    Layer.provide(taskGroupLive),
  )
