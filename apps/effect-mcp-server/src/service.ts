import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

export class Notifications extends Context.Service<
  Notifications,
  {
    readonly notify: (message: string) => Effect.Effect<void>
  }
>()('Notifications', {
  make: Effect.gen(function* () {
    yield* Effect.logInfo('Creating FooBar service')
    const notify = (message: string): Effect.Effect<string> => Effect.succeed(`${message}!`)
    return {
      notify,
    } as const
  }),
}) {
  // Build the layer yourself from the make effect
  static readonly layer = Layer.effect(this)(this.make)
}
