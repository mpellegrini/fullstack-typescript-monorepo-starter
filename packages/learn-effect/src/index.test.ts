import { ConfigProvider, Effect, Layer, ManagedRuntime } from 'effect'

import { Pokemon } from './schemas.js'
import { PokeApi } from './services/poke-api.js'
import { server } from './test/node.js'

const testConfigProvider = ConfigProvider.fromMap(new Map([['BASE_URL', 'http://localhost:3000']]))
const configProviderLayer = Layer.setConfigProvider(testConfigProvider)

const mainLayer = PokeApi.Default.pipe(Layer.provide(configProviderLayer))
const testingRuntime = ManagedRuntime.make(mainLayer)

describe('pokemon api', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('returns a valid pokemon', async () => {
    expect.hasAssertions()

    const program = Effect.gen(function* () {
      const pokeApi = yield* PokeApi
      return yield* pokeApi.getPokemon
    })

    const response = await testingRuntime.runPromise(program)
    expect(response).toStrictEqual(
      Pokemon.make({
        id: 1,
        height: 10,
        name: 'Poketest',
        order: 1,
        weight: 10,
      }),
    )
  })
})
