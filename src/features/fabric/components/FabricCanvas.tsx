'use client'

import { useObject } from '@/features/fabric/useObject'
import { canvasAtom } from '@/states/canvas'
import { selectObjectAtom } from '@/states/tools'
import { Canvas } from 'fabric'
import { useSetAtom } from 'jotai'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { MouseEvent } from 'react'

export default function FabricCanvasWrapper() {
	const [selectedObject, setSelctedObject] = useAtom(selectObjectAtom)
	const { putObject } = useObject()

	const handleAddObject = (e: MouseEvent<HTMLDivElement>) => {
		if (selectedObject === null) return
		const { clientX, clientY } = e
		putObject(clientX, clientY, selectedObject, 'red')
		setSelctedObject(null)
	}

	return (
		<div onClick={handleAddObject}>
			<FabricCanvas />
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
