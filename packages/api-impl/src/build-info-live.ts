import { Config, Effect } from 'effect'
import { HttpApiBuilder } from 'effect/unstable/httpapi'

import { Api, BuildInfo, InternalServerError, wrapSingleItemResponse } from '@packages/api'

const UNKNOWN = 'unknown'

const buildInfoConfig = Config.all({
  appName: Config.string('APP_NAME').pipe(Config.withDefault(UNKNOWN)),
  buildDate: Config.string('BUILD_DATE').pipe(Config.withDefault(UNKNOWN)),
  vcsRef: Config.string('VCS_REF').pipe(Config.withDefault(UNKNOWN)),
  version: Config.string('VERSION').pipe(Config.withDefault(UNKNOWN)),
}).pipe(Config.map((fields) => new BuildInfo(fields)))

export const buildInfoGroupLive = HttpApiBuilder.group(Api, 'info', (handlers) =>
  handlers.handle('getBuidInfo', () =>
    buildInfoConfig.pipe(
      Effect.tapError((error) =>
        Effect.logError('Unable to read build info configuration', error.message),
      ),
      Effect.mapError(
        () =>
          new InternalServerError({
            message: 'Unable to determine build information',
          }),
      ),
      Effect.map(wrapSingleItemResponse),
    ),
  ),
)
