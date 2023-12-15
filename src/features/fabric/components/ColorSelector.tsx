'use client'

import { selectedColorAtom } from '@/states/tools'
import { useAtom } from 'jotai'

export default function ColorSelector() {
	const [selectedColor, setSelctedColor] = useAtom(selectedColorAtom)

	return (
		<div className="space-y-2">
			<div>枠色・文字色</div>
			<input
				type="color"
				onChange={e => setSelctedColor(e.target.value)}
				value={selectedColor}
			/>
		</div>
	)
}
