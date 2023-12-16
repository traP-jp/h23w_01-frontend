import { getApiOrigin } from '@/lib/env'
import { fetcher } from '@/lib/fetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type User = {
	id: string
	name: string
}

export async function fetchUsers(cookies: RequestCookie[]): Promise<User[]> {
	const res = await fetcher(`${getApiOrigin()}/users`, cookies)

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}

	const data: User[] = await res.json()
	return data
}
