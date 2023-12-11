'use client'

import { useImage } from '@/features/fabric/useImage'
import { useObject } from '@/features/fabric/useObject'
import { canvasAtom } from '@/states/canvas'
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
	const inputRef = useRef<HTMLInputElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })

	const handleAddObject = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedTool !== 'object' || selectedObject === null) return
		const { clientX, clientY } = e
		putObject(clientX, clientY, selectedObject, 'red')
		setSelectedTool(null)
		setSelctedObject(null)
	}
	const handleAddText = (e: MouseEvent<HTMLDivElement>) => {}
	const handleAddImage = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedTool !== 'image' || inputRef.current === null) return
		const { clientX, clientY } = e
		setPosition({ x: clientX, y: clientY })
		inputRef.current.click()
	}
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files === null) return
		const file = files[0]
		console.log(position.x, position.y, file)
		putImage(position.x, position.y, file)
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
