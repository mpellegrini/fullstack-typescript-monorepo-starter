import { HttpApiBuilder } from '@effect/platform'
import { Config, Effect } from 'effect'

import { Api, BuildInfo, wrapSingleItemResponse } from '@packages/api'

export const buildInfoGroupLive = HttpApiBuilder.group(Api, 'info', (handlers) =>
  handlers.handle('getBuidInfo', () =>
    Effect.gen(function* () {
      const vcsRef = yield* Config.string('VCS_REF').pipe(Config.withDefault('unknown'))
      const buildDate = yield* Config.string('BUILD_DATE').pipe(Config.withDefault('unknown'))
      const version = yield* Config.string('VERSION').pipe(Config.withDefault('unknown'))
      return wrapSingleItemResponse(new BuildInfo({ buildDate, vcsRef, version }))
    }).pipe(Effect.orDie),
  ),
)
