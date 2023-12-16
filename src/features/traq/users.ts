import { getApiOrigin } from '@/lib/env'

type User = {
	id: string
	name: string
}

export async function fetchUsers(): Promise<User[]> {
	const res = await fetch(`${getApiOrigin()}/users`, {
		mode: 'no-cors',
		next: {
			revalidate: 3600
		}
	})

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}

	const data: User[] = await res.json()
	return data
}
