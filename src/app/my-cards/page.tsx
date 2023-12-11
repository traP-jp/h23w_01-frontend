import Card, { CardType } from './_components/Card'

const cards: CardType[] = Array(12).fill({
	id: 'c714a848-2886-4c10-a313-de9bc61cb2bb',
	publish_date: '2021-01-01T00:00:00',
	publish_channels: [
		{
			id: '5d53eb01-6d08-4d18-9ea6-0ce9f656c608',
			path: '#gps/times/mehm8128'
		}
	],
	message: 'oisu-'
})

export default function MyCards() {
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
