import { mockCards } from '@/features/card/mock'
import Card from './_components/Card'

const fetchCards = async () => {
	return mockCards
	// const res = await fetch(`${getApiOrigin()}/cards`, {
	// 	next: {
	// 		revalidate: 60
	// 	}
	// })

	// if (!res.ok) {
	// 	console.error(res)
	// 	throw new Error('Failed to fetch data')
	// }
	// const data: CardType[] = await res.json()
	// return data
}

export default async function MyCards() {
	const cards = await fetchCards()

	return (
		<main>
			<h1 className="w-fit mx-auto text-3xl pt-7 pb-10">自分のカード</h1>
			<div className="flex flex-wrap gap-10 px-10">
				{cards.map(card => (
					<Card key={card.id} card={card} />
				))}
			</div>
		</main>
	)
}
