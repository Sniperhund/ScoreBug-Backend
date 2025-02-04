import { createRoute, z } from "@hono/zod-openapi"
import { auth } from "../middlewares/auth.js"
import { app } from "../util/hono.js"
import { Game, GameZodObject } from "../util/database.js"
import mongoose from "mongoose"
import { count } from "console"

app.use("/admin/*", auth)

app.openapi(
	createRoute({
		method: "post",
		path: "/admin/game",
		tags: ["Admin"],
		security: [
			{
				Bearer: [],
			},
		],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							team1: z.object({
								countryCode: z.string(),
								shortCountryCode: z.string(),
								score: z.number(),
							}),
							team2: z.object({
								countryCode: z.string(),
								shortCountryCode: z.string(),
								score: z.number(),
							}),
							matchTime: z.number().default(0),
							pauseTimer: z.boolean(),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				description: "Game creation is successfully",
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
		if ((await Game.find({})).length)
			return c.json({ error: "Game already created, delete first" }, 400)

		const { team1, team2, startDate, matchLength, pauseTimer } =
			await c.req.json()

		const game = new Game({
			team1,
			team2,
			startDate,
			matchLength,
			pauseTimer,
		})

		await game.save() // Saves the game :)

		return c.json(game, 200)
	}
)

app.openapi(
	createRoute({
		method: "put",
		path: "/admin/game",
		tags: ["Admin"],
		security: [
			{
				Bearer: [],
			},
		],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							team1: z
								.object({
									countryCode: z.string(),
									shortCountryCode: z.string(),
									score: z.number(),
								})
								.optional(),
							team2: z
								.object({
									countryCode: z.string(),
									shortCountryCode: z.string(),
									score: z.number(),
								})
								.optional(),
							matchTime: z.number().default(0).optional(),
							pauseTimer: z.boolean().optional(),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				description: "Game edited successfully",
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
			return c.json({ error: "No game found" }, 400)
		}

		const game = await Game.findById(games[0]._id)

		if (!game) {
			return c.json({ error: "No game found" }, 400)
		}

		const { team1, team2, matchTime, pauseTimer } = await c.req.json()

		if (team1 != undefined) game.team1 = team1
		if (team2 != undefined) game.team2 = team2
		if (matchTime != undefined) game.matchTime = matchTime
		if (pauseTimer != undefined) game.pauseTimer = pauseTimer

		await game.save()

		return c.json(game, 200)
	}
)

app.openapi(
	createRoute({
		method: "delete",
		path: "/admin/{id}",
		tags: ["Admin"],
		security: [
			{
				Bearer: [],
			},
		],
		request: {
			params: z.object({
				id: z.string(),
			}),
		},
		responses: {
			200: {
				description: "Game deleted successfully",
			},
			400: {
				description: "Error happened",
			},
		},
	}),
	async (c) => {
		const { id } = c.req.param()

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return c.json({ error: "Invaild ID" }, 400)
		}

		const game = await Game.findById(id)

		if (!game) {
			return c.json({ error: "Game not found" }, 400)
		}

		const result = await Game.deleteOne({ _id: id })

		if (!result.acknowledged) {
			return c.json({ error: "Failed to delete game" }, 400)
		}

		return c.json({ message: "Game deleted successfully" }, 200)
	}
)
