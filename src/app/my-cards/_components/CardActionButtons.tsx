'use client'

import { Button } from '@/components/ui/button'

export default function CardActionButtons({ id }: { id: string }) {
	const deleteCard = () => {
		//TODO: impl
	}
	const editCard = () => {
		//TODO: impl
	}

	return (
		<div className="flex gap-5">
			<Button variant="destructive" size="lg" onClick={deleteCard}>
				削除
			</Button>
			<Button variant="default" size="lg" onClick={editCard}>
				編集
			</Button>
		</div>
	)
}
