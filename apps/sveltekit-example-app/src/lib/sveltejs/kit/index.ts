import type { MaybePromise } from '$app/navigation'
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit'

export type Handle = (input: {
  event: RequestEvent
  resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response>
}) => MaybePromise<Response>
