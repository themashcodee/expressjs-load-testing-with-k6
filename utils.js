export const sleep = async (time) => {
	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, time)
	})
}
