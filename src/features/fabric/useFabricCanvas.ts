import { ObjectType, useHistory } from '@/features/fabric/useHistory'
import { useImage } from '@/features/fabric/useImage'
import { useObject } from '@/features/fabric/useObject'
import { useText } from '@/features/fabric/useText'
import { canvasAtom, imagesAtoms } from '@/states/canvas'
import {
	selectObjectAtom,
	selectedStampAtom,
	selectedToolAtom
} from '@/states/tools'
import { useAtomValue, useSetAtom } from 'jotai'
import { useAtom } from 'jotai'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { MouseEvent, TouchEvent } from 'react'
import { fetchStampImage } from '../traq/stamps'
import { useStamp } from './components/stamps/useStamp'

export const useFabricCanvas = (cookies: RequestCookie[]) => {
	const divRef = useRef<HTMLDivElement>(null)
	const [selectedObject, setSelctedObject] = useAtom(selectObjectAtom)
	const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom)
	const [selectedStamp, setSelectedStamp] = useAtom(selectedStampAtom)
	const { putObject } = useObject()
	const { putImage } = useImage()
	const { putText } = useText()
	const { putStamp } = useStamp()
	const inputRef = useRef<HTMLInputElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const setImages = useSetAtom(imagesAtoms)
	const canvas = useAtomValue(canvasAtom)
	const { pushRemoveHistory, histories, undo } = useHistory()

	const handleAddObject = (offsetX: number, offsetY: number) => {
		if (selectedTool !== 'object' || selectedObject === null) {
			throw new Error('invalid state')
		}
		putObject(offsetX, offsetY, selectedObject)
		setSelectedTool(null)
		setSelctedObject(null)
	}
	const handleAddText = (offsetX: number, offsetY: number) => {
		if (selectedTool !== 'text') {
			throw new Error('invalid state')
		}
		putText(offsetX, offsetY)
		setSelectedTool(null)
	}
	const handleAddImage = (offsetX: number, offsetY: number) => {
		if (selectedTool !== 'image' || inputRef.current === null) {
			throw new Error('invalid state')
		}

		setPosition({ x: offsetX, y: offsetY })
		inputRef.current.click()
	}
	const handleAddStamp = async (offsetX: number, offsetY: number) => {
		if (selectedTool !== 'stamp' || selectedStamp === null) {
			throw new Error('invalid state')
		}
		setPosition({ x: offsetX, y: offsetY })

		const img = await fetchStampImage(selectedStamp, cookies)
		putStamp(offsetX, offsetY, img, selectedStamp.isUnicode)
		setSelectedTool(null)
		setSelectedStamp(null)
	}
	const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files === null) {
			throw new Error('files is null')
		}
		const file = files[0]
		const image = await putImage(position.x, position.y, file)
		setImages(images => [...images, image])
		setPosition({ x: 0, y: 0 })
		setSelectedTool(null)
	}

	const handleToolClick = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedTool === null) return

		const { offsetX, offsetY } = e.nativeEvent
		console.log(offsetX, offsetY)

		switch (selectedTool) {
			case 'object':
				handleAddObject(offsetX, offsetY)
				break
			case 'text':
				handleAddText(offsetX, offsetY)
				break
			case 'image':
				handleAddImage(offsetX, offsetY)
				break
			case 'stamp':
				handleAddStamp(offsetX, offsetY)
				break
			default:
				throw new Error(`invalid tool: ${selectedTool satisfies never}`)
		}
	}

	const handleToolTouch = (e: TouchEvent<HTMLDivElement>) => {
		if (selectedTool === null || divRef.current === null) return

		console.log(e)
		const { clientX, clientY } = e.touches[0]
		const [offsetX, offsetY] = [
			clientX - divRef.current.getBoundingClientRect().left,
			clientY - divRef.current.getBoundingClientRect().top
		]
		console.log(offsetX, offsetY)

		switch (selectedTool) {
			case 'object':
				handleAddObject(offsetX, offsetY)
				break
			case 'text':
				handleAddText(offsetX, offsetY)
				break
			case 'image':
				handleAddImage(offsetX, offsetY)
				break
			case 'stamp':
				handleAddStamp(offsetX, offsetY)
				break
			default:
				throw new Error(`invalid tool: ${selectedTool satisfies never}`)
		}
	}

	useEffect(() => {
		if (canvas === null) {
			return
		}

		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Delete') {
				const activeObjects = canvas.getActiveObjects()
				const objectTypes = activeObjects.map(
					object => object.type as ObjectType
				)
				for (const object of activeObjects) {
					canvas.remove(object)
				}
				canvas.discardActiveObject()
				pushRemoveHistory(objectTypes)
			}

			if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
				const target = histories.at(-1)
				if (target === undefined) {
					throw new Error('history not found')
				}
				undo(target.id)
			}
		}

		document.addEventListener('keydown', handleKeydown, { passive: true })
		return () => {
			document.removeEventListener('keydown', handleKeydown)
		}
	})

	return {
		divRef,
		inputRef,
		onChange,
		handleToolClick,
		handleToolTouch
	}
}
