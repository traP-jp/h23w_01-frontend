import Card from '@/app/cards/_components/Card'
import CardOwnerSwitch from '@/features/card/components/CardOwnerSwitch'
import { CardType } from '@/features/card/type'
import { fetchChannels } from '@/features/traq/channels'
import { fetchUsers } from '@/features/traq/users'
import { SHOWCASE_USER_KEY } from '@/lib/auth'
import { getApiOrigin } from '@/lib/env'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies, headers } from 'next/headers'

export type CardOwner = 'me' | 'all'

const fetchCards = async (owner: CardOwner, cookies: RequestCookie[]) => {
	const ownerQuery = owner === 'me' ? '/me' : ''
	const res = await fetch(`${getApiOrigin()}/cards${ownerQuery}`, {
		mode: 'no-cors',
		cache: 'no-store',
		headers: {
			cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
		},
		credentials: 'include'
	})

	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}
	const data: CardType[] = await res.json()
	return data
}

export default async function Cards({
	searchParams: { owner }
}: { searchParams: { owner: CardOwner } }) {
	const cookieStore = cookies()
	const cookieList = cookieStore.getAll()
	const cards = await fetchCards(owner, cookieList)
	const headerList = headers()
	const meId = headerList.get(SHOWCASE_USER_KEY)
	const usersMap = new Map(
		(await fetchUsers(cookies().getAll())).map(user => [user.id, user.name])
	)
	const { channelMap } = await fetchChannels(cookieList)

	return (
		<main className="px-10 w-full">
			<div className="pt-7 pb-10 flex items-center justify-between">
				<h1 className="text-3xl">Qard一覧</h1>
				<CardOwnerSwitch owner={owner} />
			</div>
			<div className="flex flex-wrap gap-10">
				{cards.map(card => (
					<Card
						key={card.id}
						card={card}
						usersMap={usersMap}
						meId={meId}
						channelMap={channelMap}
					/>
				))}
			</div>
		</main>
	)
}
