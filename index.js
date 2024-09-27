import express from "express"
import { db, Database } from "./db.js"
import { sleep } from "./utils.js"
import { config } from "dotenv"
config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = process.env.PORT

app.get("/", (req, res) => {
	res.send("Hello World!")
})
app.post("/api/v1/users", async (req, res) => {
	try {
		const { uuid, email, first_name, last_name } = req.body
		const newUser = await db.users.create({
			data: {
				uuid,
				email,
				first_name,
				last_name,
			},
		})

		// WAITING FOR 1 SECOND BECAUSE IN REAL APP THERE WOULD BE A LOT OF OTHER THINGS THAT NEEDS TO BE DONE WHEN USER IS CREATED
		await sleep(1000)

		res.status(201).json(newUser)
	} catch (error) {
		console.error(error)
		res
			.status(500)
			.json({ error: "An error occurred while creating the user." })
	}
})
app.get("/api/v1/users/:uuid", async (req, res) => {
	try {
		const { uuid } = req.params
		const user = await db.users.findUnique({ where: { uuid } })
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(404).json({ error: "User not found." })
		}
	} catch (error) {
		console.error(error)
		res
			.status(500)
			.json({ error: "An error occurred while retrieving the user." })
	}
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})

// SHUTTING DOWN GRACEFULLY
async function graceful_shutdown(signal) {
	console.info(`RECEIVED ${signal}. SHUTTING DOWN GRACEFULLY.`)
	await Database.closeDB()
	process.exit(0)
}
process.on("SIGINT", async () => {
	await graceful_shutdown("SIGINT")
})
process.on("SIGTERM", async () => {
	await graceful_shutdown("SIGTERM")
})
