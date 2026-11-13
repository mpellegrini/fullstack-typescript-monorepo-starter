import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as NodeStdio from '@effect/platform-node/NodeStdio'
import * as McpProtocol from 'effect/ai/McpProtocol'
import * as McpServer from 'effect/ai/McpServer'
import * as Layer from 'effect/Layer'
import * as Logger from 'effect/Logger'

import { McpServerLayer } from './mcp-server.ts'

McpServer.layerStdio({
  name: 'Demo Server',
  protocols: [McpProtocol.v2026_07_28, McpProtocol.v2025_11_25],
  registrations: McpServerLayer,
  version: '0.0.0',
}).pipe(
  Layer.provide(NodeStdio.layer),
  Layer.provide(Logger.layer([Logger.consolePretty()])),
  Layer.provideMerge(Layer.succeed(Logger.LogToStderr)(true)),
  Layer.launch,
  NodeRuntime.runMain,
)
