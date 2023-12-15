type User = {
	id: string
	name: string
}

export async function getUsers(): Promise<User[]> {
	// TODO: 実装
	//GET /api/users
	fetch('https://h23w-01-backend.trap.show/api/users')

	const users: User[] = []
	for (let i = 0; i < 30; i++) {
		users.push({
			id: i.toString(),
			name: `us${i}er${i}`
		})
	}
	return users
}
