import { CardType } from '@/features/card/type'
import { http, HttpResponse } from 'msw'

export const mockCards: CardType[] = Array(12).fill({
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

export const cardHandlers = (origin: string) => [
	http.get(`${origin}/cards`, () => {
		return HttpResponse.json(mockCards)
	})
]
