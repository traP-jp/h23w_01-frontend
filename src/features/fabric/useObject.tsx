import { canvasAtom } from '@/states/canvas'
import { selectedColorAtom } from '@/states/tools'
import { CircleIcon, SquareIcon, VercelLogoIcon } from '@radix-ui/react-icons'
import { Circle, Rect, Triangle } from 'fabric'
import { useAtomValue } from 'jotai'

export const objects = [
	{ name: '円', value: 'circle', icon: <CircleIcon width={32} height={32} /> },
	{
		name: '三角形',
		value: 'triangle',
		icon: <VercelLogoIcon width={32} height={32} />
	},
	{
		name: '矩形',
		value: 'rectangle',
		icon: <SquareIcon width={32} height={32} />
	}
	// { name: '星', value: 'star', icon: <StarIcon width={32} height={32} /> }
] as const

export type ObjectType = (typeof objects)[number]['value']

export const useObject = () => {
	const canvas = useAtomValue(canvasAtom)
	const selectedColor = useAtomValue(selectedColorAtom)

	const putObject = (offsetX: number, offsetY: number, object: ObjectType) => {
		if (canvas == null) {
			return
		}
		switch (object) {
			case 'circle': {
				const shape = new Circle({
					left: offsetX - 50,
					top: offsetY - 50,
					radius: 50,
					fill: 'transparent',
					stroke: selectedColor,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			case 'rectangle': {
				const shape = new Rect({
					left: offsetX - 50,
					top: offsetY - 50,
					width: 100,
					height: 100,
					fill: 'transparent',
					stroke: selectedColor,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			case 'triangle': {
				const shape = new Triangle({
					left: offsetX - 50,
					top: offsetY - 50,
					width: 100,
					height: 100,
					fill: 'transparent',
					stroke: selectedColor,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			// case 'star': {
			// 	const shape = new Star({
			// 		left: offsetX - 50,
			// 		top: offsetY - 30,
			// 		rx: 50,
			// 		ry: 30,
			// 		fill: 'transparent',
			// 		stroke: selectedColor,
			// 		strokeWidth: 1
			// 	})
			// 	canvas.add(shape)
			// 	break
			// }
			default:
				throw new Error(`invalid object: ${object satisfies never}`)
		}
	}

	return { putObject }
}
