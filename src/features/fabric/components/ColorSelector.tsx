'use client'

import { selectedColorAtom } from '@/states/tools'
import { useAtom } from 'jotai'

export default function ColorSelector() {
	const [selectedColor, setSelctedColor] = useAtom(selectedColorAtom)

	return (
		<div>
			<input
				type="color"
				onChange={e => setSelctedColor(e.target.value)}
				value={selectedColor}
			/>
			<p>{selectedColor}を選択中</p>
		</div>
	)
}
