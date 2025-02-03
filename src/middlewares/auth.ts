import { createMiddleware } from "hono/factory"

export const auth = createMiddleware(async (c, next) => {
	const authoration = c.req.header("Authorization")

	if (!authoration || !authoration.startsWith("Bearer ")) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	if (authoration.replace("Bearer ", "") != process.env.ADMIN_TOKEN) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	await next()
})
