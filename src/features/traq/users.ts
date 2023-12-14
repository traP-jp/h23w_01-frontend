type user = {
	id: string
	name: string
}

export async function getUsers(): Promise<user[]> {
	// TODO: 実装
	//GET /api/users

	const users: user[] = []
	for (let i = 0; i < 30; i++) {
		users.push({
			id: i.toString(),
			name: `us${i}er${i}`
		})
	}
	return users
}
