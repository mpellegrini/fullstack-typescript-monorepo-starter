import { NodeServices } from '@effect/platform-node'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as McpProtocol from 'effect/ai/McpProtocol'
import * as McpServer from 'effect/ai/McpServer'
import * as Layer from 'effect/Layer'
import * as Logger from 'effect/Logger'

import { McpServerLayer } from './mcp-server.ts'

McpServer.layerStdio({
  name: 'Demo Server',
  protocols: [McpProtocol.v2025_06_18],
  version: '0.0.0',
}).pipe(
  Layer.provide([McpServerLayer, NodeServices.layer]),
  Layer.provide(Layer.succeed(Logger.LogToStderr)(true)),
  Layer.launch,
  NodeRuntime.runMain,
)
