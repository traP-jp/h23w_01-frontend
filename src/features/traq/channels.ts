import { getApiOrigin } from '@/lib/env'
import { fetcher } from '@/lib/fetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type ChannelRes = {
	id: string
	name: string
	parentId: string | null
	children: string[]
}

export type Channel = {
	id: string
	name: string
}

export const fetchChannels = async (cookies: RequestCookie[]) => {
	const res = await fetcher(`${getApiOrigin()}/channels`, cookies)

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: ChannelRes[] = await res.json()
	const channelsMap = new Map<string, ChannelRes>()
	const rootChannels: ChannelRes[] = []
	for (const channel of data) {
		channelsMap.set(channel.id, channel)
		if (channel.parentId === null) {
			rootChannels.push(channel)
		}
	}

	const stack = [...rootChannels]

	const result: Channel[] = []

	while (stack.length > 0) {
		// スタックから取り出す
		const channel = stack.pop()
		if (channel === undefined) {
			continue
		}

		// 子チャンネルをスタックに積む
		for (const childId of channel.children) {
			const child = channelsMap.get(childId)
			if (child !== undefined) {
				stack.push(child)
			}
		}

		if (channel.parentId === null) {
			result.push({
				id: channel.id,
				name: channel.name
			})
			continue
		}

		const parent = channelsMap.get(channel.parentId)
		if (parent === undefined) {
			console.error('parent not found')
			continue
		}
		result.push({
			id: channel.id,
			name: `${parent?.name}/${channel.name}`
		})
		// 本当のチャンネル名に更新
		channelsMap.set(channel.id, {
			...channel,
			name: `${parent?.name}/${channel.name}`
		})
	}

	return result
}
