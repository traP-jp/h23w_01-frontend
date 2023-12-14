import { canvasAtom } from '@/states/canvas'
import { FabricImage } from 'fabric'
import { useAtomValue } from 'jotai'

const getImageSize = async (file: Blob) => {
	const imgEle = new Image()
	imgEle.src = URL.createObjectURL(file)
	return new Promise<{
		width: number
		height: number
		imgEle: HTMLImageElement
	}>(resolve => {
		imgEle.onload = () => {
			resolve({
				width: imgEle.naturalWidth,
				height: imgEle.naturalHeight,
				imgEle
			})
		}
	})
}

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
		const img = new FabricImage(imgData.imgEle, {
			left: offsetX - w / 2,
			top: offsetY - h / 2,
			width: w,
			height: h
		})
		canvas.add(img)
		return { id, src: stampImage }
	}

	return { putStamp: putStamp }
}
