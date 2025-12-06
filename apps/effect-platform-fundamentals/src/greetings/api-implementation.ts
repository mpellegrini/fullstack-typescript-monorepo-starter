import * as HttpApiBuilder from '@effect/platform/HttpApiBuilder'
import * as Effect from 'effect/Effect'

import { api } from '../api.js'

/**
 * The HttpApiBuilder.group() API is used to implement a specific group of
 * endpoints within an HttpApi definition.
 *
 * The HttpApiBuilder.group() API produces a Layer that can later be
 * provided to the server implementation.
 */
export const greetingsApiLive = HttpApiBuilder.group(api, 'greetings', (handlers) =>
  handlers
    // handle method maps the endpoint's definition to its corresponding implementation.
    .handle('hello-world', () => Effect.succeed('Hello World!')),
)
