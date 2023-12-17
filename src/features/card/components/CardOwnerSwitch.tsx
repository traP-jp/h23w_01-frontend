'use client'

import { CardOwner } from '@/app/cards/page'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'

export default function CardOwnerSwitch({ owner }: { owner: CardOwner }) {
	const router = useRouter()

	const checked = owner === 'me'
	const handleChange = (val: boolean) => {
		router.replace(`/cards?owner=${val ? 'me' : 'all'}`)
	}

	return (
		<label className="flex items-center gap-2">
			<span>自分のカードのみ表示</span>
			<Switch checked={checked} onCheckedChange={handleChange} />
		</label>
	)
}
