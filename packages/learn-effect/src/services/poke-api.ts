import { Effect, Schema } from 'effect'

import { FetchError, JsonError } from '../errors.js'
import { Pokemon } from '../schemas.js'

import { BuildPokeApiUrl } from './build-poke-api-url.js'
import { PokemonCollection } from './pokemon-collection.js'

export class PokeApi extends Effect.Service<PokeApi>()('PokeApi', {
  dependencies: [PokemonCollection.Default, BuildPokeApiUrl.Default],
  effect: Effect.gen(function* () {
    const pokemonCollection = yield* PokemonCollection
    const buildPokeApiUrl = yield* BuildPokeApiUrl

    return {
      getPokemon: Effect.gen(function* () {
        const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] })

        const response = yield* Effect.tryPromise({
          catch: () => new FetchError(),
          try: () => fetch(requestUrl),
        })

        if (!response.ok) {
          return yield* new FetchError()
        }

        const json = yield* Effect.tryPromise({
          catch: () => new JsonError(),
          try: () => response.json(),
        })

        return yield* Schema.decodeUnknown(Pokemon)(json)
      }),
    }
  }),
}) {}
