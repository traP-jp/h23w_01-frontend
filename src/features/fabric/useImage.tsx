import { canvasAtom } from '@/states/canvas'
import { FabricImage } from 'fabric'
import { useAtomValue } from 'jotai'

export const useImage = () => {
	const canvas = useAtomValue(canvasAtom)

	const putImage = (clientX: number, clientY: number, file: File) => {
		if (canvas == null) {
			return
		}
		const imgEle = new Image()
		imgEle.src = URL.createObjectURL(file)
		const img = new FabricImage(imgEle, {
			left: clientX,
			top: clientY,
			width: 100,
			height: 100
		})
		canvas.add(img)
	}

	return { putImage }
}
