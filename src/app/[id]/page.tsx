import console from 'console'
import { CardType } from '@/features/card/type'
import ColorSelector from '@/features/fabric/components/ColorSelector'
import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import History from '@/features/fabric/components/History'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'
import OtherSelector from '@/features/fabric/components/OtherSelector'
import { PostForm } from '@/features/form/Form'
import { fetchChannels } from '@/features/traq/channels'
import { SHOWCASE_USER_KEY } from '@/lib/auth'
import { getApiOrigin } from '@/lib/env'
import { headers } from 'next/headers'

const fetchCard = async (id: string) => {
	const res = await fetch(`${getApiOrigin()}/cards/${id}`, {
		mode: 'no-cors',
		next: {
			revalidate: 60
		}
	})

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: CardType = await res.json()
	return data
}

const fetchCardSvg = async (id: string) => {
	const res = await fetch(`${getApiOrigin()}/cards/${id}/svg`, {
		mode: 'no-cors',
		next: {
			revalidate: 60
		}
	})

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: string = await res.text()
	return data
}

export default async function EditCard({
	params: { id }
}: {
	params: { id: string }
}) {
	const headerList = headers()
	const userId = headerList.get(SHOWCASE_USER_KEY)
	const channels = await fetchChannels()
	const card = await fetchCard(id)
	const cardSvg = await fetchCardSvg(id)

	const initialFormValue = {
		message: card.message,
		sendDateTime: new Date(card.publish_date),
		sendChannels: card.publish_channels
	}

	return (
		<main className="flex gap-12 pt-8 px-10">
			<div className="space-y-8 flex-1">
				<ColorSelector />
				<ObjectSelector />
				<OtherSelector />
			</div>
			<div>
				<FabricCanvasWrapper initialSvg={cardSvg} />
			</div>
			<div className="flex flex-col justify-between flex-1">
				<History />
				<PostForm
					userId={userId}
					initialValue={initialFormValue}
					channels={channels}
				/>
			</div>
		</main>
	)
}
