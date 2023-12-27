'use client'

import { RequestBody } from '@/app/api/json/route'
import { Button } from '@/components/ui/button'
import { getApiOrigin } from '@/lib/env'
import Link from 'next/link'

export default function CardActionButtons({ id }: { id: string }) {
	const deleteCard = async () => {
		const res = await fetch('/api/json', {
			method: 'POST',
			body: JSON.stringify({
				url: `${getApiOrigin()}/cards/${id}`,
				method: 'DELETE'
			} satisfies RequestBody)
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
