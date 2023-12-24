import { Stamp } from '@/features/traq/stamps'
import { getImageSize } from '@/lib/image'
import { canvasAtom, imagesAtoms } from '@/states/canvas'
import { util, FabricImage, FabricObject, Point, loadSVGFromURL } from 'fabric'
import { useAtomValue, useSetAtom } from 'jotai'

export const useStamp = () => {
	const canvas = useAtomValue(canvasAtom)
	const setImages = useSetAtom(imagesAtoms)

	const putStamp = async (
		offsetX: number,
		offsetY: number,
		stampImage: Blob,
		stamp: Stamp
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
		if (stamp.isUnicode) {
			const list: FabricObject[] = []
			await loadSVGFromURL(stamp.path, (_, object) => {
				list.push(object)
			})
			const result = util.groupSVGElements(list)
			result.scaleToWidth(100)
			result.scaleToHeight(100)
			result.setXY(new Point(offsetX - 50, offsetY - 50))
			canvas.add(result)
			canvas.renderAll()
		} else {
			const img = await FabricImage.fromURL(stamp.path)
			img.scaleToWidth(100)
			img.scaleToHeight(100)
			img.setXY(new Point(offsetX - 50, offsetY - 50))
			canvas.add(img)
		}

		return { id, src: stampImage }
	}

	return { putStamp: putStamp }
}
