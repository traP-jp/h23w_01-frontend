import { canvasAtom } from '@/states/canvas'
import { FabricImage } from 'fabric'
import { useAtomValue } from 'jotai'

export const useImage = () => {
	const canvas = useAtomValue(canvasAtom)

	const putImage = (offsetX: number, offsetY: number, file: File) => {
		if (canvas == null) {
			throw new Error('canvas is null')
		}
		const imgEle = new Image()
		imgEle.src = URL.createObjectURL(file)
		const id = imgEle.src.split('/').at(-1)
		if (!id) {
			throw new Error(`invalid id: ${id}`)
		}
		const img = new FabricImage(imgEle, {
			left: offsetX,
			top: offsetY,
			width: 100,
			height: 100
		})
		canvas.add(img)
		return { id, src: file }
	}

	return { putImage }
}
