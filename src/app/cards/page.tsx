import Card from '@/app/cards/_components/Card'
import CardOwnerSwitch from '@/features/card/components/CardOwnerSwitch'
import { CardType } from '@/features/card/type'
import { getApiOrigin } from '@/lib/env'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { fetchUsers } from '@/features/traq/users'
import { cookies } from 'next/headers'

export type CardOwner = 'me' | 'all'

const fetchCards = async (owner: CardOwner, cookies: RequestCookie[]) => {
	const ownerQuery = owner === 'me' ? '/me' : ''
	const res = await fetch(`${getApiOrigin()}/cards${ownerQuery}`, {
		mode: 'no-cors',
		next: {
			revalidate: 60
		},
		headers: {
			cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
		}
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

	const usersMap = new Map(
		(await fetchUsers(cookies().getAll())).map(user => [
			user.id,
			user.name
		]) as Array<[string, string]>
	)

	return (
		<main className="px-10">
			<div className="pt-7 pb-10 flex items-center justify-between">
				<h1 className="text-3xl">自分のカード</h1>
				<CardOwnerSwitch owner={owner} />
			</div>
			<div className="flex flex-wrap gap-10">
				{cards.map(card => (
					<Card key={card.id} card={card} usersMap={usersMap} />
				))}
			</div>
		</main>
	)
}
