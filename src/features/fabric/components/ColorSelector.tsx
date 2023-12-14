'use client'

import { selectedColorAtom } from '@/states/tools'
import { useAtom } from 'jotai'

export default function ColorSelector() {
	const [selectedColor, setSelctedColor] = useAtom(selectedColorAtom)

	return (
		<div className="space-y-2">
			<div>色</div>
			<div className="flex items-cetner gap-4">
				<input
					type="color"
					onChange={e => setSelctedColor(e.target.value)}
					value={selectedColor}
				/>
				<p>{selectedColor}を選択中</p>
			</div>
		</div>
	)
}
