import express from "express"
import { db, Database } from "./db.js"
import { sleep } from "./utils.js"
import { variables } from "./variables.js"
import { v4 as uuidv4 } from "uuid"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = variables.PORT

app.get("/", (req, res) => {
	res.send("Hello World!")
})
app.post("/api/v1/users", async (req, res) => {
	try {
		const { email, first_name, last_name } = req.body

		const existing_user = await db.users.findFirst({
			where: {
				email: email,
			},
			select: {
				id: true,
			},
		})

		if (existing_user) {
			return res.status(404).json({
				success: false,
				code: 404,
				error: "User already exist with this email",
			})
		}

		const newUser = await db.users.create({
			data: {
				uuid: uuidv4(),
				email,
				first_name,
				last_name,
			},
		})

		// WAITING FOR 200 MILLISECONDS BECAUSE IN REAL APP THERE WOULD BE A LOT OF OTHER THINGS THAT NEEDS TO BE DONE WHEN USER IS CREATED
		await sleep(200)

		res.status(201).json({
			success: true,
			code: 201,
			data: {
				user: newUser,
			},
		})
	} catch (error) {
		console.error(error)

		res.status(500).json({
			success: false,
			code: 500,
			error: "An error occurred while creating the user.",
		})
	}
})
app.get("/api/v1/users/:uuid", async (req, res) => {
	try {
		const { uuid } = req.params
		const user = await db.users.findUnique({ where: { uuid } })

		if (!user) {
			return res.status(404).json({
				success: false,
				code: 404,
				error: "User not found.",
			})
		}

		res.status(200).json({
			success: true,
			code: 200,
			data: {
				user,
			},
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			code: 500,
			error: "An error occurred while retrieving the user.",
		})
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
