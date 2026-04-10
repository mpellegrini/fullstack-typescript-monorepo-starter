import type { RequestHandler } from '@sveltejs/kit'

import { env } from '$env/dynamic/private'
import { createOpenAI } from '@ai-sdk/openai'
import { type UIMessage, convertToModelMessages, stepCountIs, streamText, tool } from 'ai'
import { z } from 'zod'

const openai = createOpenAI({ apiKey: env['OPENAI_API_KEY'] })

export const POST: RequestHandler = async ({ request }) => {
  // TODO: this should be addressed with Zod as a type guard
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- need to fix
  const { messages } = (await request.json()) as { messages: UIMessage[] }

  const result = streamText({
    messages: await convertToModelMessages(messages),
    model: openai('gpt-4o'),
    stopWhen: stepCountIs(5),
    tools: {
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        execute: ({ temperature }) => {
          const celsius = Math.round(temperature - 32) * (5 / 9)
          return {
            celsius,
          }
        },
        inputSchema: z.object({
          temperature: z.number().describe('The temperature in fahrenheit to convert'),
        }),
      }),
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        execute: ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32)
          return {
            location,
            temperature,
          }
        },
        inputSchema: z.object({
          location: z.string().describe('the location to get the weather for'),
        }),
      }),
    },
  })
  return result.toUIMessageStreamResponse()
}
