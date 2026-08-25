import { NodeHttpServer } from '@effect/platform-node'
import { Config, Layer } from 'effect'
import { HttpRouter } from 'effect/unstable/http'
import { HttpApiScalar } from 'effect/unstable/httpapi'
import { createServer } from 'node:http'

import { Api } from '@packages/api'
import { ApiLive } from '@packages/api-impl'

const ServerLive = Layer.unwrap(
  Config.int('PORT')
    .pipe(Config.withDefault(3000))
    .pipe(Config.map((port) => NodeHttpServer.layer(createServer, { port }))),
)

const DocsLive = HttpApiScalar.layer(Api, { scalar: { layout: 'modern', theme: 'kepler' } })

export const HttpLive = HttpRouter.serve(Layer.mergeAll(ApiLive, DocsLive, HttpRouter.cors())).pipe(
  Layer.provide(ServerLive),
)
