import { getApiOrigin } from '@/lib/env'

export type Channel = {
	id: string
	name: string
}

export const fetchChannels = async () => {
	const res = await fetch(`${getApiOrigin()}/channels`, {
		mode: 'no-cors',
		next: {
			revalidate: 3600
		}
	})

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: Channel[] = await res.json()
	return data
}
