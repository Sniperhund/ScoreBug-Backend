import { createRoute } from "@hono/zod-openapi"
import { app } from "../util/hono.js"
import { Game, GameZodObject } from "../util/database.js"

app.openapi(
	createRoute({
		method: "get",
		path: "/game",
		tags: ["Game"],
		responses: {
			200: {
				description: "Current game",
				content: {
					"application/json": {
						schema: GameZodObject,
					},
				},
			},
			400: {
				description: "Error happened",
			},
		},
	}),
	async (c) => {
		const games = await Game.find({})

		if (games.length == 0) {
			return c.json({ error: "No active game" }, 400)
		}

		return c.json(games[0], 200)
	}
)
