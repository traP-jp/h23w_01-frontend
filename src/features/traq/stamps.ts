import { getApiOrigin } from '@/lib/env'
import { fetchUsers } from './users'

export type Stamp = {
	id: string
	name: string
	path: string
	isUser: boolean
}

async function fetchStamps(): Promise<Stamp[]> {
	const fetchUnicodeStamps = () => {
		return fetch(`${getApiOrigin()}/stamps?type=unicode`, {
			mode: 'no-cors',
			next: {
				revalidate: 3600
			}
		})
	}

	const fetchOriginalStamps = () => {
		return fetch(`${getApiOrigin()}/stamps?type=original`, {
			mode: 'no-cors',
			next: {
				revalidate: 3600
			}
		})
	}

	return Promise.all([fetchUnicodeStamps(), fetchOriginalStamps()]).then(
		async ([unicodeRes, originalRes]) => {
			if (!unicodeRes.ok || !originalRes.ok) {
				console.error(unicodeRes, originalRes)
				throw new Error('Failed to fetch data')
			}

			const [unicodeData, originalData] = await Promise.all([
				unicodeRes.json(),
				originalRes.json()
			])
			for (const stamp of unicodeData) {
				stamp.path = `${getApiOrigin()}/stamps/${stamp.id}/image`
				stamp.isUser = false
			}
			for (const stamp of originalData) {
				stamp.path = `${getApiOrigin()}/stamps/${stamp.id}/image`
				stamp.isUser = false
				stamp.id = `${stamp.id}-o`
				// クエリパラメーターの対応がされるまでは2セット来てidがかぶるから、oってつける
			}
			return unicodeData.concat(originalData)
		}
	)
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

	return await res.blob()
}
