import { canvasAtom } from '@/states/canvas'
import { History, historiesAtom, undoingAtom } from '@/states/history'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

export type ObjectType =
	| 'circle'
	| 'triangle'
	| 'rect'
	| 'star'
	| 'textbox'
	| 'image'
export type OperationType = 'add' | 'modify' | 'remove'

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
	remove: '削除'
}

export const useHistory = () => {
	const canvas = useAtomValue(canvasAtom)
	const [histories, setHistories] = useAtom(historiesAtom)
	// undoでの追加や編集はhistoryに追加しないようにするフラグ
	const [undoing, setUndoing] = useAtom(undoingAtom)

	const pushRemoveHistory = (objectTypes: ObjectType[]) => {
		if (canvas === null || undoing) {
			return
		}
		if (objectTypes.length === 0) {
			return
		}
		const id = crypto.randomUUID()
		const newHistory: History = {
			id,
			json: JSON.stringify(canvas),
			name: objectTypes.map(type => objectMap[type]).join('、'),
			operation: 'remove',
			time: new Date()
		}
		setHistories(histories.concat([newHistory]))
	}

	const undo = async (targetId: string) => {
		if (canvas === null) {
			return
		}
		setUndoing(true)
		const index = histories.findIndex(history => history.id === targetId)
		if (index === -1) {
			throw new Error('history not found')
		}
		if (index === 0) {
			canvas.clear()
			setHistories([])
			setUndoing(false)
			return
		}
		const content = histories[index - 1].json
		await canvas.loadFromJSON(content, () => {
			canvas.renderAll()
			// targetId以降を全て削除
			setHistories(histories.slice(0, index))
		})
		setUndoing(false)
	}

	useEffect(() => {
		if (canvas === null) {
			return
		}

		// biome-ignore lint/suspicious/noExplicitAny: TODO: eventの型が分からん
		const addEventHandler = (e: any) => {
			if (undoing) {
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
			setHistories(histories.concat([newHistory]))
		}

		// biome-ignore lint/suspicious/noExplicitAny: TODO: eventの型が分からん
		const modifyEventHandler = (e: any) => {
			if (undoing) {
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
			setHistories(histories.concat([newHistory]))
		}

		// 図形が追加されたとき
		canvas.on('object:added', addEventHandler)
		// 図形が編集されたとき(移動・変形など)
		canvas.on('object:modified', modifyEventHandler)

		return () => {
			canvas.off('object:added', addEventHandler)
			canvas.off('object:modified', modifyEventHandler)
		}
	}, [canvas, histories, setHistories, undoing])

	return { histories, pushRemoveHistory, undo }
}
