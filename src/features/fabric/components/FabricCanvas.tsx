'use client'

import { useFabricCanvas } from '@/features/fabric/useFabricCanvas'
import { canvasAtom } from '@/states/canvas'
import { Canvas } from 'fabric'
import { useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

export default function FabricCanvasWrapper() {
	const { inputRef, onChange, handleToolClick } = useFabricCanvas()

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
