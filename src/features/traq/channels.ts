import { getApiOrigin } from '@/lib/env'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { fetcher } from '@/lib/fetch'

export type Channel = {
	id: string
	name: string
}

export const fetchChannels = async (cookies: RequestCookie[]) => {
	console.log(cookies)
	const res = await fetcher(`${getApiOrigin()}/channels`, cookies)

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: Channel[] = await res.json()
	return data
}
