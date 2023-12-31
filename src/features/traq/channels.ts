import { getApiOrigin } from '@/lib/env'
import { fetcher } from '@/lib/fetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type ChannelRes = {
	id: string
	name: string
	archived: boolean
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
	const data: ChannelRes[] = (await res.json()).public
	const channels = data.filter(channel => !channel.archived)
	const channelsMap = new Map<string, ChannelRes>()
	const rootChannels: ChannelRes[] = []
	for (const channel of channels) {
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

	const channelMap = new Map<string, string>()
	for (const channel of result) {
		channelMap.set(channel.id, channel.name)
	}

	return {
		channels: result
			.filter(
				channel =>
					channel.name.startsWith('gps') ||
					channel.name.startsWith('event/hackathon/23winter')
			)
			.toSorted((a, b) => {
				if (a.name < b.name) {
					return -1
				}
				if (a.name > b.name) {
					return 1
				}
				return 0
			}),
		channelMap
	}
}
