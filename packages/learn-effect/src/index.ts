import { Effect, Layer, ManagedRuntime } from 'effect'

import { PokeApi } from './services/poke-api.js'

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi
  return yield* pokeApi.getPokemon
})

const main = program.pipe(
  Effect.catchTags({
    FetchError: (error) => Effect.succeed(`Fetch error ${JSON.stringify(error)}`),
    JsonError: (error) => Effect.succeed(`JSON error ${JSON.stringify(error)}`),
    ParseError: (error) => Effect.succeed(`Parse error ${JSON.stringify(error)}`),
  }),
)

const mainLayer = Layer.mergeAll(PokeApi.Default)
const managedRuntime = ManagedRuntime.make(mainLayer)
await managedRuntime.runPromise(main).then(console.log)
