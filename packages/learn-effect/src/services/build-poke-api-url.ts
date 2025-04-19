import { Effect } from 'effect'

import { PokeApiUrl } from './poke-api-url.js'

export class BuildPokeApiUrl extends Effect.Service<BuildPokeApiUrl>()('BuildPokeApiUrl', {
  dependencies: [PokeApiUrl.LIVE],
  effect: Effect.gen(function* () {
    const pokeApiUrl = yield* PokeApiUrl
    return ({ name }: { name: string }) => `${pokeApiUrl}/${name}`
  }),
}) {}
