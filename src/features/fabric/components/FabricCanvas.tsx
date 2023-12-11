'use client'

import { useImage } from '@/features/fabric/useImage'
import { useObject } from '@/features/fabric/useObject'
import { useText } from '@/features/fabric/useText'
import { canvasAtom, imagesAtoms } from '@/states/canvas'
import { selectObjectAtom, selectedToolAtom } from '@/states/tools'
import { Canvas } from 'fabric'
import { useSetAtom } from 'jotai'
import { useAtom } from 'jotai'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { MouseEvent } from 'react'

export default function FabricCanvasWrapper() {
	const [selectedObject, setSelctedObject] = useAtom(selectObjectAtom)
	const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom)
	const { putObject } = useObject()
	const { putImage } = useImage()
	const { putText } = useText()
	const inputRef = useRef<HTMLInputElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const setImages = useSetAtom(imagesAtoms)

	const handleAddObject = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedTool !== 'object' || selectedObject === null) {
			throw new Error('invalid state')
		}
		const { offsetX, offsetY } = e.nativeEvent
		putObject(offsetX, offsetY, selectedObject)
		setSelectedTool(null)
		setSelctedObject(null)
	}
	const handleAddText = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedTool !== 'text') {
			throw new Error('invalid state')
		}
		const { offsetX, offsetY } = e.nativeEvent
		putText(offsetX, offsetY)
		setSelectedTool(null)
	}
	const handleAddImage = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedTool !== 'image' || inputRef.current === null) {
			throw new Error('invalid state')
		}
		const { offsetX, offsetY } = e.nativeEvent
		setPosition({ x: offsetX, y: offsetY })
		inputRef.current.click()
	}
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files === null) {
			throw new Error('files is null')
		}
		const file = files[0]
		const image = putImage(position.x, position.y, file)
		setImages(images => [...images, image])
		setPosition({ x: 0, y: 0 })
		setSelectedTool(null)
	}

	const handleToolClick = (e: MouseEvent<HTMLInputElement>) => {
		if (selectedTool === null) return
		switch (selectedTool) {
			case 'object':
				handleAddObject(e)
				break
			case 'text':
				handleAddText(e)
				break
			case 'image':
				handleAddImage(e)
				break
			default:
				throw new Error(`invalid tool: ${selectedTool satisfies never}`)
		}
	}

	return (
		<div onClick={handleToolClick}>
			<FabricCanvas />
			<input
				type="file"
				className="hidden"
				ref={inputRef}
				accept=".jpg,.jpeg,.png,.psd,.tif,.tiff"
				onClick={e => e.stopPropagation()}
				onChange={onChange}
			/>
		</div>
	)
}

function FabricCanvas() {
	const canvasEl = useRef<HTMLCanvasElement>(null)
	const setCanvas = useSetAtom(canvasAtom)

	useEffect(() => {
		if (!canvasEl.current) return
		const canvas = new Canvas(canvasEl.current, {
			height: 740,
			width: 500
		})

		setCanvas(canvas)
		return () => {
			setCanvas(null)
			canvas.dispose()
		}
	}, [setCanvas])

	return <canvas width="500" height="740" ref={canvasEl} className="border" />
}
