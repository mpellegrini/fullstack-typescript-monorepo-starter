import type { createRoute, OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'

export interface CustomEnv {
  Variables: object
}

export type AppOpenApi = OpenAPIHono<CustomEnv>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, CustomEnv>

export type RouteResponse = Parameters<typeof createRoute>[0]['responses']
