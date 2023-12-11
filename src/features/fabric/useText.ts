import { canvasAtom } from '@/states/canvas'
import { Textbox } from 'fabric'
import { useAtomValue } from 'jotai'

export const useText = () => {
	const canvas = useAtomValue(canvasAtom)

	const putText = (offsetX: number, offsetY: number) => {
		if (canvas == null) {
			throw new Error('canvas is null')
		}
		const img = new Textbox('テキストを入力', {
			width: 80,
			fontSize: 20,
			left: offsetX,
			top: offsetY
		})
		canvas.add(img)
	}

	return { putText }
}
