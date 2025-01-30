import { serve } from "@hono/node-server"
import { app } from "./util/hono.js"
import { prettyJSON } from "hono/pretty-json"
import { swaggerUI } from "@hono/swagger-ui"
import { db } from "./util/database.js"
import { cors } from "hono/cors"
import "dotenv/config"
import ip from "ip"
import chalk from "chalk"

db(process.env.MONGODB_URI)

app.use(cors())
app.use(prettyJSON())

app.get("/docs", swaggerUI({ url: "/doc" }))
app.doc("/doc", {
	info: {
		title: "ScoreBug API",
		version: "v1",
	},
	openapi: "3.1.0",
})

app.get("/", (c) => {
	return c.json({ message: "Hello, world" })
})

import "./routes/admin.js"
import "./routes/game.js"

const port = 3000
console.log(
	chalk.green(`Server is running on 
	Local: ${chalk.blue(`http://localhost:${port}`)}
	Network: ${chalk.blue(`http://${ip.address()}:${port}`)}\n`)
)

serve({
	fetch: app.fetch,
	port,
})
