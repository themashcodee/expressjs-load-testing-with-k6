import http from "k6/http"
import { check, group } from "k6"

export let options = {
	stages: [
		{ duration: "0.1m", target: 0 },
		{ duration: "0.5m", target: 1 },
		{ duration: "0.1m", target: 0 },
	],
}

export default function () {
	group("USER", () => {
		const ids = [
			"98f4b4e9-876d-4f58-adb3-bb3a218eef55",
			"0c2c6c3a-d43a-4ef7-b6c0-4be6c7d63e5b",
			"a18db769-959d-46b6-99b0-bdcc901f72d1",
			"8a40e5fd-20cb-4325-a832-1836e9dd8b49",
		]
		const randomId = ids[Math.floor(Math.random() * ids.length)]

		const response = http.get(`SERVER_URL/api/v1/users/${randomId}`)

		check(response, {
			"status code should be 200": (res) => res.status === 200,
		})
	})
}
