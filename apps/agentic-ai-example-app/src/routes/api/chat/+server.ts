import { OPENAI_API_KEY } from '$env/static/private'
import { createOpenAI } from '@ai-sdk/openai'
import type { RequestHandler } from '@sveltejs/kit'
import { convertToModelMessages, streamText, tool, type UIMessage } from 'ai'
import { z } from 'zod'

const openai = createOpenAI({ apiKey: OPENAI_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages }: { messages: UIMessage[] } = await request.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('the location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32)
          return {
            location,
            temperature,
          }
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        inputSchema: z.object({
          temperature: z.number().describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round(temperature - 32) * (5 / 9)
          return {
            celsius,
          }
        },
      }),
    },
  })
  return result.toUIMessageStreamResponse()
}
