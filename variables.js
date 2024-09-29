import { config } from "dotenv"
config()

export const variables = {
	PORT: process.env.PORT,
	BASE_URL: process.env.BASE_URL,
}
