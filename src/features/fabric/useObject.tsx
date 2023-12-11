import { canvasAtom } from '@/states/canvas'
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

	const putObject = (
		clientX: number,
		clientY: number,
		object: ObjectType,
		color: string
	) => {
		if (canvas == null) {
			return
		}
		switch (object) {
			case 'circle': {
				const shape = new Circle({
					left: clientX - 50,
					top: clientY - 50,
					radius: 50,
					fill: 'transparent',
					stroke: color,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			case 'rectangle': {
				const shape = new Rect({
					left: clientX - 50,
					top: clientY - 50,
					width: 100,
					height: 100,
					fill: 'transparent',
					stroke: color,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			case 'triangle': {
				const shape = new Triangle({
					left: clientX - 50,
					top: clientY - 50,
					width: 100,
					height: 100,
					fill: 'transparent',
					stroke: color,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			// case 'star': {
			// 	const shape = new Star({
			// 		left: clientX - 50,
			// 		top: clientY - 30,
			// 		rx: 50,
			// 		ry: 30,
			// 		fill: 'transparent',
			// 		stroke: color,
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
