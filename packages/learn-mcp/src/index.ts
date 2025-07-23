import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'

import { StreamableHTTPTransport } from '@hono/mcp'
import { serve } from '@hono/node-server'
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { Hono } from 'hono'
import { z } from 'zod'

const server = new McpServer({
  name: 'demo-server',
  version: '0.0.1',
})

server.registerTool(
  'add',
  {
    description: 'Add two numbers',
    inputSchema: { a: z.number(), b: z.number() },
    title: 'Addition  Tool',
  },
  ({ a, b }) => ({
    content: [{ text: String(a + b), type: 'text' }],
  }),
)

server.registerResource(
  'greeting',
  new ResourceTemplate('greeting://{name}', { list: undefined }),
  {
    description: 'Dynamic greeting resource',
    mimeType: 'text/plain',
    title: 'Greeting Resource',
  },
  (uri, { name }) => ({
    contents: [
      {
        text: `Hello ${name?.toString()}`,
        uri: uri.href,
      },
    ],
  }),
)

const transport = new StreamableHTTPTransport()

let isConnected = false

const connectedToServer = async (): Promise<void> => {
  await server.connect(transport as Transport)
  isConnected = true
}

const app = new Hono()
app.all('/mcp', async (ctx) => {
  if (!isConnected) await connectedToServer()
  return transport.handleRequest(ctx)
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.info(`Server is running on http://localhost:${info.port}`)
  },
)
