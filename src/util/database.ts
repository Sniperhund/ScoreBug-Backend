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
		score: Number,
	},
	team2: {
		countryCode: String,
		score: Number,
	},
	startDate: Date,
	matchLength: Number, // Increment matchLength at half (15 minutes)
	pauseTimer: Boolean,
})

export const Game = mongoose.model("Game", gameSchema)
