import { Stamp } from '@/features/traq/stamps'

export const getMatchedStampsWithPriority = (
	stamps: readonly Stamp[],
	query: string
): Stamp[] => {
	if (query === '') return []

	if (query === '@') {
		return []
	}

	const matchedValuesArray = new Array<{ value: Stamp; priority: number }>()

	for (const stamp of stamps) {
		const lowerStampName = stamp.name.toLowerCase()
		if (stamp.isUser !== query.startsWith('@')) continue
		const q = query.replace('@', '')
		if (q === lowerStampName) {
			matchedValuesArray.push({ value: stamp, priority: 0 })
		} else if (lowerStampName.startsWith(q)) {
			matchedValuesArray.push({ value: stamp, priority: 1 })
		} else if (lowerStampName.includes(q)) {
			matchedValuesArray.push({ value: stamp, priority: 2 })
		}
	}

	const sortedValuesArray = matchedValuesArray.sort(
		(a, b) => a.priority - b.priority
	)

	return sortedValuesArray.map(v => v.value)
}
