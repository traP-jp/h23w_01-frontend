import { getApiOrigin } from '@/lib/env'
import { fetcher } from '@/lib/fetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { fetchUsers } from './users'

export type Stamp = {
	id: string
	name: string
	path: string
	isUser: boolean
}

async function fetchStamps(cookies: RequestCookie[]): Promise<Stamp[]> {
	const fetchUnicodeStamps = () => {
		return fetcher(`${getApiOrigin()}/stamps?type=unicode`, cookies)
	}

	const fetchOriginalStamps = () => {
		return fetcher(`${getApiOrigin()}/stamps?type=original`, cookies)
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
				stamp.path = `https://q.trap.jp/api/1.0/public/emoji/${stamp.id}`
				stamp.isUser = false
			}
			for (const stamp of originalData) {
				stamp.path = `https://q.trap.jp/api/1.0/public/emoji/${stamp.id}`
				stamp.isUser = false
				stamp.id = `${stamp.id}-o`
				// クエリパラメーターの対応がされるまでは2セット来てidがかぶるから、oってつける
			}
			return unicodeData.concat(originalData)
		}
	)
}

export async function fetchAllStamps(
	cookies: RequestCookie[]
): Promise<Stamp[]> {
	const stamps = await fetchStamps(cookies)
	const users = await fetchUsers(cookies)

	return stamps.concat(
		users.map(user => ({
			id: user.id,
			name: user.name,
			path: `https://q.trap.jp/api/v3/public/icon/${user.name}`,
			isUser: true
		}))
	)
}

export async function fetchStampImage(stamp: Stamp, cookies: RequestCookie[]) {
	const res = await fetcher(stamp.path, cookies)
	const blob = await res.blob()

	return blob
}
