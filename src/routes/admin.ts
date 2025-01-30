import { auth } from "../middlewares/auth.js"
import { app } from "../util/hono.js"

app.use(auth)
