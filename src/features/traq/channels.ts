export type channel = {
	id: string
	name: string
}

export const getChannels = (): channel[] => {
	//TODO: 実装
	return [
		{
			id: crypto.randomUUID(),
			name: 'general'
		},
		{
			id: crypto.randomUUID(),
			name: 'random'
		},
		{
			id: crypto.randomUUID(),
			name: 'gps'
		},
		{
			id: crypto.randomUUID(),
			name: 'univ'
		}
	]
}
