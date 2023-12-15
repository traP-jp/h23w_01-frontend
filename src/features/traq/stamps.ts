import { getUsers } from './users'

type StampResponse = {
	id: string
	name: string
	creatorId: string
	createdAt: string
	updatedAt: string
	fileId: string
	isUnicode: boolean
	hasThumbnail: boolean
}

export type Stamp = {
	id: string
	name: string
	path: string
	isUser: boolean
}

async function fetchStamps(): Promise<Stamp[]> {
	//GET /api/stamps
	// TODO: 実装
	const stamps: Stamp[] = []
	for (let i = 0; i < 30; i++) {
		stamps.push({
			id: i.toString(),
			name: `st${i}amp${i}`,
			path: 'https://q.trap.jp/api/v3/public/icon/ikura-hamu',
			isUser: false
		})
	}
	return stamps
}

export async function fetchAllStamps(): Promise<Stamp[]> {
	const stamps = await fetchStamps()
	const users = await getUsers()

	return stamps.concat(
		users.map(user => ({
			id: user.id,
			name: user.name,
			path: 'https://q.trap.jp/api/v3/public/icon/BOT_ikura-hamu',
			// path: `https://q.trap.jp/api/v3/public/icon/${user.id}`,
			isUser: true
		}))
	)
}

export async function fetchStampImage(stamp: Stamp): Promise<Blob> {
	//GET /api/stamps/:stampId/image
	const res = await fetch(stamp.path)

	return res.blob()
}
