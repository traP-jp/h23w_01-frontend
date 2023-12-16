'use client'

import { Button } from '@/components/ui/button'
import { getApiOrigin } from '@/lib/env'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import Link from 'next/link'

export default function CardActionButtons({
	id,
	cookies
}: { id: string; cookies: RequestCookie[] }) {
	const deleteCard = async () => {
		const res = await fetch(`${getApiOrigin()}/cards/${id}`, {
			method: 'DELETE',
			headers: {
				cookie: cookies
					.map(cookie => `${cookie.name}=${cookie.value}`)
					.join('; ')
			}
		})
		if (!res.ok) {
			throw new Error('Failed to post form')
		}
		//TODO: mutate
	}

	return (
		<div className="flex gap-5">
			<Button variant="destructive" size="lg" onClick={deleteCard}>
				削除
			</Button>
			<Button variant="default" size="lg" asChild>
				<Link href={`/${id}`}>編集</Link>
			</Button>
		</div>
	)
}
