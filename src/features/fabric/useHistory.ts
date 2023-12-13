import { canvasAtom } from '@/states/canvas'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'

type ObjectType = 'circle' | 'triangle' | 'rect' | 'star' | 'textbox' | 'image'
type OperationType = 'add' | 'modify' | 'delete'

interface History {
	id: string
	json: string
	name: string
	operation: OperationType
	time: Date
}

const objectMap: Record<ObjectType, string> = {
	circle: '円',
	triangle: '三角形',
	rect: '四角形',
	star: '星',
	textbox: 'テキスト',
	image: '画像'
}

export const operationMap: Record<OperationType, string> = {
	add: '追加',
	modify: '編集',
	delete: '削除'
}

export const useHistory = () => {
	const canvas = useAtomValue(canvasAtom)
	const [histories, setHistories] = useState<History[]>([])
	// undoでの追加や編集はhistoryに追加しないようにするフラグ
	const undoing = useRef(false)

	const undo = async (targetId: string) => {
		if (canvas === null) {
			return
		}
		undoing.current = true
		const index = histories.findIndex(history => history.id === targetId)
		if (index === -1) {
			throw new Error('history not found')
		}
		if (index === 0) {
			canvas.clear()
			setHistories([])
			undoing.current = false
			return
		}
		const content = histories[index - 1].json
		await canvas.loadFromJSON(content, () => {
			canvas.renderAll()
			// targetId以降を全て削除
			setHistories(histories.slice(0, index))
		})
		undoing.current = false
	}

	useEffect(() => {
		if (canvas === null) {
			return
		}

		// biome-ignore lint/suspicious/noExplicitAny: TODO: eventの型が分からん
		const onEventHandler = (e: any) => {
			if (undoing.current) {
				return
			}
			const objectType = e.target.type as ObjectType
			const objectName = objectMap[objectType]
			const id = crypto.randomUUID()
			const newHistory: History = {
				id,
				json: JSON.stringify(canvas),
				name: objectName,
				operation: 'add',
				time: new Date()
			}
			setHistories([...histories, newHistory])
		}

		// biome-ignore lint/suspicious/noExplicitAny: TODO: eventの型が分からん
		const offEventHandler = (e: any) => {
			if (undoing.current) {
				return
			}
			const objectType = e.target.type as ObjectType
			const objectName = objectMap[objectType]
			const id = crypto.randomUUID()
			const newHistory: History = {
				id,
				json: JSON.stringify(canvas),
				name: objectName,
				operation: 'modify',
				time: new Date()
			}
			setHistories([...histories, newHistory])
		}

		// 図形が追加されたとき
		canvas.on('object:added', onEventHandler)
		// 図形が編集されたとき(移動・変形など)
		canvas.on('object:modified', offEventHandler)

		return () => {
			canvas.off('object:added', onEventHandler)
			canvas.off('object:modified', offEventHandler)
		}
	}, [canvas, histories])

	return { history: histories, undo }
}
