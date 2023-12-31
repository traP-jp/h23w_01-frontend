import { canvasAtom } from '@/states/canvas'
import { historiesAtom, historyLockedAtom } from '@/states/history'
import { History } from '@/states/history'
import { selectedColorAtom, selectedInnerColorAtom } from '@/states/tools'
import {
	CircleIcon,
	SquareIcon,
	StarIcon,
	VercelLogoIcon
} from '@radix-ui/react-icons'
import { Circle, Path, Rect, Triangle } from 'fabric'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

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
	},
	{ name: '星', value: 'star', icon: <StarIcon width={32} height={32} /> }
] as const

export type ObjectType = (typeof objects)[number]['value']

export const useObject = () => {
	const canvas = useAtomValue(canvasAtom)
	const selectedColor = useAtomValue(selectedColorAtom)
	const selectedInnerColor = useAtomValue(selectedInnerColorAtom)
	const setHistoryLocked = useSetAtom(historyLockedAtom)
	const [histories, setHistories] = useAtom(historiesAtom)

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
					fill: selectedInnerColor,
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
					fill: selectedInnerColor,
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
					fill: selectedInnerColor,
					stroke: selectedColor,
					strokeWidth: 1
				})
				canvas.add(shape)
				break
			}
			case 'star': {
				setHistoryLocked(true)
				const shape = new Path(
					'M50 2l12 36h38l-30 24 12 36-30-24-30 24 12-36-30-24h38z',
					{
						left: offsetX - 50,
						top: offsetY - 50,
						width: 100,
						height: 100,
						fill: selectedInnerColor,
						stroke: selectedColor,
						strokeWidth: 1
					}
				)
				canvas.add(shape)

				const id = crypto.randomUUID()
				const newHistory: History = {
					id,
					json: JSON.stringify(canvas),
					name: '星',
					operation: 'add',
					time: new Date()
				}
				setHistories(histories.concat([newHistory]))

				setHistoryLocked(false)
				break
			}
			default:
				throw new Error(`invalid object: ${object satisfies never}`)
		}
	}

	return { putObject }
}
