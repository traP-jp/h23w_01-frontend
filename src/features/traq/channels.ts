import { getApiOrigin } from '@/lib/env'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export type Channel = {
	id: string
	name: string
}

export const fetchChannels = async (cookies: RequestCookie[]) => {
	console.log(cookies)
	const res = await fetch(`${getApiOrigin()}/channels`, {
		mode: 'no-cors',
		next: {
			revalidate: 3600
		},
		headers: {
			cookie: `${cookies.map(c => `${c.name}=${c.value}`).join('; ')}`
		}
	})

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: Channel[] = await res.json()
	return data
}
