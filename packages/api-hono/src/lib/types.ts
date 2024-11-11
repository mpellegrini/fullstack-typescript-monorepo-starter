import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'

export interface CustomEnv {
  Variables: object
}

export type AppOpenApi = OpenAPIHono<CustomEnv>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, CustomEnv>
