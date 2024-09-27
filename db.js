import { PrismaClient } from "@prisma/client"

export class Database {
	static instance

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new PrismaClient({
				log: ["info", "warn", "error"],
			})
		}
		return Database.instance
	}

	static async closeDB() {
		try {
			await Database.instance.$disconnect()
		} catch (err) {
			console.error(err, "ERROR CLOSING DB CONNECTION")
			await Database.instance.$disconnect()
			process.exit(1)
		}
	}
}

export const db = Database.getInstance()
