import { canvasAtom } from '@/states/canvas'
import { FabricImage } from 'fabric'
import { useAtomValue } from 'jotai'

const getImageSize = async (file: File) => {
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

export const useImage = () => {
	const canvas = useAtomValue(canvasAtom)

	const putImage = async (offsetX: number, offsetY: number, file: File) => {
		if (canvas == null) {
			throw new Error('canvas is null')
		}
		const imgData = await getImageSize(file)
		const id = imgData.imgEle.src.split('/').at(-1)
		if (!id) {
			throw new Error(`invalid id: ${id}`)
		}

		const img = new FabricImage(imgData.imgEle, {
			left: offsetX,
			top: offsetY,
			width: imgData.width,
			height: imgData.height
		})
		canvas.add(img)
		return { id, src: file }
	}

	return { putImage }
}
