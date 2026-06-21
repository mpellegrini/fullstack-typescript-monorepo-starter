import { NodeServices } from '@effect/platform-node'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Layer from 'effect/Layer'
import * as Logger from 'effect/Logger'
import * as McpServer from 'effect/unstable/ai/McpServer'

import { McpServerLayer } from './mcp-server.ts'

McpServer.layerStdio({
  name: 'Demo Server',
  version: '0.0.0',
}).pipe(
  Layer.provide([McpServerLayer, NodeServices.layer]),
  Layer.provide(Layer.succeed(Logger.LogToStderr)(true)),
  Layer.launch,
  NodeRuntime.runMain,
)
