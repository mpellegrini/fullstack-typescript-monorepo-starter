## MCP Server Example
```typescript
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import * as McpSchema from 'effect/unstable/ai/McpSchema'
import * as McpServer from 'effect/unstable/ai/McpServer'
import * as Tool from 'effect/unstable/ai/Tool'
import * as Toolkit from 'effect/unstable/ai/Toolkit'

// ─── Tools ───────────────────────────────────────────────────────────

const DemoTool = Tool.make('DemoTool', {
  description: 'This is a demo tool for the documentation',
  parameters: Schema.Struct({
    demoId: Schema.Number,
    demoName: Schema.String,
  }),
  success: Schema.String,
})

const OtherDemoTool = Tool.make('OtherDemoTool', {
  description: 'Another demo tool',
  parameters: Schema.Struct({
    value: Schema.Number,
  }),
  success: Schema.String,
})

const MyToolkit = Toolkit.make(DemoTool, OtherDemoTool)

const ToolkitLayer = McpServer.toolkit(MyToolkit).pipe(
  Layer.provide(
    MyToolkit.toLayer({
      DemoTool: ({ demoId, demoName }) => Effect.succeed(`Processed ${demoName} with ID ${demoId}`),
      OtherDemoTool: ({ value }) => Effect.succeed(`Other tool result: ${value * 2}`),
    }),
  ),
)

// ─── Resources ───────────────────────────────────────────────────────

const StatusResource = McpServer.resource({
  content: Effect.succeed(JSON.stringify({ status: 'running', version: '1.0.0' }, null, 2)),
  description: 'Current server status information',
  mimeType: 'application/json',
  name: 'Server Status',
  uri: 'server://status',
})

const demoIdParam = McpSchema.param('id', Schema.NumberFromString)

const DemoResource = McpServer.resource`server://demos/${demoIdParam}`({
  completion: {
    id: (_input: string) => Effect.succeed([1, 2, 3, 4, 5]),
  },
  content: (_uri: string, id: number) =>
    Effect.succeed(
      JSON.stringify({ id, createdAt: new Date().toISOString(), name: `Demo ${id}` }, null, 2),
    ),
  description: 'Retrieve a demo by ID',
  mimeType: 'application/json',
  name: 'Demo Resource',
})

// ─── Prompts ─────────────────────────────────────────────────────────

const Focus = Schema.Literals(['summary', 'details'])

const AnalysisPrompt = McpServer.prompt({
  completion: {
    topic: (_input: string) => Effect.succeed(['performance', 'architecture', 'testing']),
  },
  content: ({ focus, topic }: { readonly focus: string; readonly topic: string }) =>
    Effect.succeed(`Please analyze "${topic}" with a ${focus} focus. Be thorough and specific.`),
  description: 'Analyze a topic with a specified focus',
  name: 'Analyze',
  parameters: {
    focus: Focus,
    topic: Schema.String,
  },
})

// ─── Composed MCP Layer ──────────────────────────────────────────────

export const McpLayer = Layer.mergeAll(
  ToolkitLayer,
  StatusResource,
  DemoResource,
  AnalysisPrompt,
).pipe(
  Layer.provide(
    McpServer.layerHttp({
      name: 'Demo MCP Server',
      path: '/mcp',
      version: '1.0.0',
    }),
  ),
)
```
## Running the Server
```typescript
import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as HttpRouter from 'effect/unstable/http/HttpRouter'
import * as HttpServerResponse from 'effect/unstable/http/HttpServerResponse'
import { createServer } from 'node:http'

import { ApiRouter, ApiScalarRouter, ApiSwaggerRouter } from './http-api.ts'
import { McpLayer } from './mcp-server.ts'

const HelloRouter = HttpRouter.add('GET', '/hello', (_request) =>
  Effect.succeed(HttpServerResponse.text('Hello, World!')),
)

const AllRouters = Layer.mergeAll(ApiRouter, ApiScalarRouter, ApiSwaggerRouter, HelloRouter, McpLayer)

// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpRouter.serve(AllRouters).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

// Launch the server
Layer.launch(ServerLive).pipe(NodeRuntime.runMain)
```
## Testing the Server
```shell
 curl -s -X POST http://localhost:3000/mcp \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     -d
   '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'
   2>&1
```
