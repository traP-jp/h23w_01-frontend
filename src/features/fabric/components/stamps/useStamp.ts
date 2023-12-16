import { getImageSize } from '@/lib/image'
import { canvasAtom } from '@/states/canvas'
import { FabricImage, Point } from 'fabric'
import { useAtomValue } from 'jotai'

export const useStamp = () => {
	const canvas = useAtomValue(canvasAtom)

	const putStamp = async (
		offsetX: number,
		offsetY: number,
		stampImage: Blob
	) => {
		if (canvas == null) {
			throw new Error('canvas is null')
		}
		const imgData = await getImageSize(stampImage)
		const id = imgData.imgEle.src.split('/').at(-1)
		if (!id) {
			throw new Error(`invalid id: ${id}`)
		}

		const w = imgData.width
		const h = imgData.height
		const img = new FabricImage(imgData.imgEle)
		img.scaleToWidth(100)
		img.scaleToHeight(100)
		img.setXY(new Point(offsetX - 50, offsetY - 50))

		canvas.add(img)
		return { id, src: imgData.imgEle.src }
	}

	return { putStamp: putStamp }
}
