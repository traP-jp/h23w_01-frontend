'use client'

import { selectedInnerColorAtom } from '@/states/tools'
import { useAtom } from 'jotai'
import { ChangeEvent, useState } from 'react'

export default function InnerColorSelector() {
	const [savedColor, setSavedColor] = useState('#FFFFFF')
	const [selectedColor, setSelctedColor] = useAtom(selectedInnerColorAtom)

	const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSavedColor(selectedColor)
		}
		setSelctedColor(e.target.checked ? 'transparent' : savedColor)
	}

	return (
		<div className="space-y-2">
			<div>塗りつぶし色</div>
			<div>
				<label className="space-x-1">
					<input
						type="checkbox"
						checked={selectedColor === 'transparent'}
						onChange={handleChangeCheckbox}
					/>
					<span>透明</span>
				</label>
				<div>
					<input
						type="color"
						onChange={e => setSelctedColor(e.target.value)}
						value={selectedColor === 'transparent' ? savedColor : selectedColor}
					/>
				</div>
			</div>
		</div>
	)
}
