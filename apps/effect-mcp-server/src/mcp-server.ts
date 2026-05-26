import { NodeServices } from '@effect/platform-node'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Logger from 'effect/Logger'
import * as Schema from 'effect/Schema'
import * as McpServer from 'effect/unstable/ai/McpServer'
import * as Tool from 'effect/unstable/ai/Tool'
import * as Toolkit from 'effect/unstable/ai/Toolkit'

const toolkit = Toolkit.make(
  Tool.make('DemoTool', {
    description: 'This is a demo tool for the documentation',
    parameters: Schema.Struct({
      demoId: Schema.Number,
      demoName: Schema.String,
    }),
    success: Schema.String,
  })
    .annotate(Tool.Readonly, true)
    .annotate(Tool.Destructive, false),

  Tool.make('OtherDemoTool', {
    description: 'Another demo tool',
    parameters: Schema.Struct({
      value: Schema.Number,
    }),
    success: Schema.String,
  })
    .annotate(Tool.Readonly, true)
    .annotate(Tool.Destructive, false),
)

const ToolkitLayer = toolkit.toLayer(
  Effect.gen(function* () {
    yield* Effect.logInfo('ToolKit Layer')
    return toolkit.of({
      DemoTool: Effect.fn(function* ({ demoId, demoName }) {
        yield* Effect.logInfo('DemoTool Called')
        return `Processed ${demoName} with ID ${demoId}`
      }),
      OtherDemoTool: Effect.fn(function* ({ value }) {
        yield* Effect.logInfo('OtherDemoTool Called')
        return `Other tool result: ${value * 2}`
      }),
    })
  }),
)

export const McpServerToolkit = McpServer.toolkit(toolkit).pipe(Layer.provide(ToolkitLayer))

McpServer.layerStdio({
  name: 'Demo Server',
  version: '0.0.0',
}).pipe(
  Layer.provide([McpServerToolkit, NodeServices.layer]),
  Layer.provide(Layer.succeed(Logger.LogToStderr)(true)),
  Layer.launch,
  NodeRuntime.runMain,
)
