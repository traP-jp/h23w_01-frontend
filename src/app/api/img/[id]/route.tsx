import { getApiOrigin } from '@/lib/env'
import { cookies } from 'next/headers'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export interface RequestBody {
	url: string
}

export async function GET(
		req: NextRequest,
		{ params: { id } }: { params: { id: string } }
	) {
		const cookieStore = cookies()
		const cookieList = cookieStore.getAll()
		const url = `${getApiOrigin()}/stamps/${id}/image`

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				cookie: `${cookieList.map(c => `${c.name}=${c.value}`).join('; ')}`
			},
			credentials: 'include'
		})
		if (!response.ok) {
			console.error(response)
			throw new Error('Failed to fetch data')
		}

		const src = await response.arrayBuffer()

		return new ImageResponse(
			// @ts-ignore
			<img src={src} width={128} height={128} alt="スタンプ" />,
			{
				width: 128,
				height: 128
			}
		)
	}
