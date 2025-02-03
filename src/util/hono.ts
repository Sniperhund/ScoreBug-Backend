import { OpenAPIHono } from "@hono/zod-openapi"

export const app = new OpenAPIHono()

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
	type: "http",
	scheme: "bearer",
})
