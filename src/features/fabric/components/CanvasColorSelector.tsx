'use client'

import { canvasAtom } from '@/states/canvas'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

export default function CanvasColorSelector() {
	const canvas = useAtomValue(canvasAtom)
	const [selectedColor, setSelctedColor] = useState('#FFFFFF')

	const handleSetColor = (color: string) => {
		if (canvas === null) {
			return
		}
		setSelctedColor(color)
		canvas.backgroundColor = color
		canvas.renderAll()
	}

	return (
		<div className="space-y-2">
			<div>キャンバスの背景色</div>
			<input
				type="color"
				onChange={e => handleSetColor(e.target.value)}
				value={selectedColor}
			/>
		</div>
	)
}
