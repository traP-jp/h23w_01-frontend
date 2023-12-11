import { canvasAtom } from '@/states/canvas'
import { selectedColorAtom } from '@/states/tools'
import { Textbox } from 'fabric'
import { useAtomValue } from 'jotai'

export const useText = () => {
	const canvas = useAtomValue(canvasAtom)
	const selectedColor = useAtomValue(selectedColorAtom)

	const putText = (offsetX: number, offsetY: number) => {
		if (canvas == null) {
			throw new Error('canvas is null')
		}
		const img = new Textbox('テキストを入力', {
			width: 80,
			fontSize: 20,
			left: offsetX,
			top: offsetY,
			stroke: selectedColor
		})
		canvas.add(img)
	}

	return { putText }
}
