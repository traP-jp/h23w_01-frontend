import { stamp } from '@/features/traq/stamps'

export const getMatchedStampsWithPriority = (
	stamps: readonly stamp[],
	query: string
): stamp[] => {
	if (query === '') return []

	if (query === '@') {
		return stamps.filter(stamp => stamp.isUser)
	}

	// if (query.length === 1) {

	// }

	const matchedValuesArray = new Array<{ value: stamp; priority: number }>()

	for (const stamp of stamps) {
		if (stamp.isUser !== query.startsWith('@')) continue
		const q = query.replace('@', '')
		if (q === stamp.name) {
			matchedValuesArray.push({ value: stamp, priority: 0 })
		} else if (stamp.name.startsWith(q)) {
			matchedValuesArray.push({ value: stamp, priority: 1 })
		} else if (stamp.name.includes(q)) {
			matchedValuesArray.push({ value: stamp, priority: 2 })
		}
	}

	const sortedValuesArray = matchedValuesArray.sort(
		(a, b) => a.priority - b.priority
	)

	return sortedValuesArray.map(v => v.value)
}
