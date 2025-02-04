import { z } from "@hono/zod-openapi"
import mongoose from "mongoose"

export const db = (uri: string | undefined) => {
	if (!uri) throw new Error("Database URI is required")

	mongoose.connect(uri)

	mongoose.connection.on("connected", () => {
		console.log("Database connected!")
	})

	mongoose.connection.on("error", (err) => {
		console.log("Database error: " + err)
	})
}

const gameSchema = new mongoose.Schema({
	team1: {
		countryCode: String,
		shortCountryCode: String,
		score: Number,
	},
	team2: {
		countryCode: String,
		shortCountryCode: String,
		score: Number,
	},
	matchTime: Number,
	pauseTimer: Boolean,
})

export const Game = mongoose.model("Game", gameSchema)

export const GameZodObject = z.object({
	_id: z.string(),
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
	matchTime: z.number().default(60),
	pauseTimer: z.boolean(),
})
