import { fetchUsers } from './users'
import { getApiOrigin } from '@/lib/env'

export type Stamp = {
	id: string
	name: string
	path: string
	isUser: boolean
}

async function fetchStamps(): Promise<Stamp[]> {
	const unicodeRes = await fetch(`${getApiOrigin()}/stamps?type=unicode`, {
		mode: 'no-cors',
		next: {
			revalidate: 3600
		}
	})

	if (!unicodeRes.ok) {
		console.error(unicodeRes)
		throw new Error('Failed to fetch data')
	}

	const unicodeData: Stamp[] = await unicodeRes.json()
	for (const stamp of unicodeData) {
		stamp.path = `${getApiOrigin()}/stamps/${stamp.id}/image`
		stamp.isUser = false
	}

	const originalRes = await fetch(`${getApiOrigin()}/stamps?type=original`, {
		mode: 'no-cors',
		next: {
			revalidate: 3600
		}
	})

	if (!originalRes.ok) {
		console.error(unicodeRes)
		throw new Error('Failed to fetch data')
	}

	const originalData: Stamp[] = await originalRes.json()
	for (const stamp of originalData) {
		stamp.path = `${getApiOrigin()}/stamps/${stamp.id}/image`
		stamp.isUser = false
	}

	return unicodeData.concat(originalData)
}

export async function fetchAllStamps(): Promise<Stamp[]> {
	const stamps = await fetchStamps()
	const users = await fetchUsers()

	return stamps.concat(
		users.map(user => ({
			id: user.id,
			name: user.name,
			path: `${getApiOrigin()}/users/${user.id}/icon`,
			isUser: true
		}))
	)
}

export async function fetchStampImage(stamp: Stamp): Promise<Blob> {
	const res = await fetch(stamp.path)

	return res.blob()
}
