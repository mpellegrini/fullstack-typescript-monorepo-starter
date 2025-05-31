import { Effect, Layer, ManagedRuntime, Redacted } from 'effect'

import { DataSource, layer } from './index.js'

describe('effectful queries', () => {
  const mainLayer = Layer.mergeAll(
    layer({
      connectionString: Redacted.make('postgresql://postgres:postgres@localhost:5432/postgres'),
      loggingEnabled: false,
      ssl: false,
    }),
  )

  const managedRuntime = ManagedRuntime.make(mainLayer)

  it('should execute a query', async () => {
    expect.assertions(0)

    const main = Effect.gen(function* () {
      const { db } = yield* DataSource
      const result = yield* Effect.tryPromise(() => db.query('SELECT 1'))
      yield* Effect.logError(JSON.stringify(result.rowCount, null, 2))
    })

    // await managedRuntime.runPromise(main.pipe(Effect.provide(mainLayer), Effect.scoped))
    const res = await managedRuntime.runPromiseExit(main.pipe(Effect.provide(mainLayer)))
    console.log(res)
  })
})
