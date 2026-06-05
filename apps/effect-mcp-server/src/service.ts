import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

export class MyService extends Context.Service<
  MyService,
  {
    readonly demoTool: (demoId: number, demoName: string) => Effect.Effect<string>
    readonly otherDemoTool: (value: number) => Effect.Effect<string>
  }
>()('MyService', {
  make: Effect.gen(function* () {
    yield* Effect.logInfo('Creating FooBar service')
    const demoTool = (demoId: number, demoName: string): Effect.Effect<string> =>
      Effect.succeed(`Processed ${demoName} with ID ${demoId}`)
    const otherDemoTool = (value: number): Effect.Effect<string> =>
      Effect.succeed(`Other tool result: ${value * 2}`)
    return {
      demoTool,
      otherDemoTool,
    } as const
  }),
}) {
  // Build the layer yourself from the make effect
  static readonly layer = Layer.effect(this)(this.make)
}
