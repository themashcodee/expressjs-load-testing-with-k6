import http from "k6/http"
import { check, group } from "k6"

export let options = {
	stages: [
		{ duration: "0.1m", target: 0 },
		{ duration: "1m", target: 500 },
		{ duration: "0.1m", target: 0 },
	],
}

function generateUniqueId() {
	return `user-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`
}

export default function () {
	group("USER", () => {
		const params = {
			headers: {
				"Content-Type": "application/json",
			},
		}

		for (let i = 1; i <= 2; i++) {
			const id = generateUniqueId()
			const response = http.post(
				"SERVER_URL/api/v1/users",
				JSON.stringify({
					email: `${id}@gmail.com`,
					last_name: "Account",
					first_name: `Test ${id}`,
				}),
				params
			)
			check(response, {
				"status code should be 201": (res) => res.status === 201,
			})
		}
	})
}
