'use client'

import { useFabricCanvas } from '@/features/fabric/useFabricCanvas'
import { canvasAtom } from '@/states/canvas'
import { historyLockedAtom } from '@/states/history'
import { Canvas, loadSVGFromString } from 'fabric'
import { useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

export default function FabricCanvasWrapper({
	initialSvg
}: { initialSvg?: string }) {
	const { inputRef, onChange, handleToolClick } = useFabricCanvas()

	return (
		<div onClick={handleToolClick}>
			<FabricCanvas initialSvg={initialSvg} />
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

function FabricCanvas({ initialSvg }: { initialSvg?: string }) {
	const canvasEl = useRef<HTMLCanvasElement>(null)
	const setCanvas = useSetAtom(canvasAtom)
	const setHistoryLocked = useSetAtom(historyLockedAtom)

	useEffect(() => {
		if (!canvasEl.current) return
		const canvas = new Canvas(canvasEl.current, {
			height: 740,
			width: 500
		})

		setCanvas(canvas)

		if (initialSvg !== undefined) {
			setHistoryLocked(true)
			loadSVGFromString(initialSvg, (_, object) => {
				canvas.add(object)
				canvas.renderAll()
				setHistoryLocked(false)
			})
		}

		return () => {
			setCanvas(null)
			canvas.dispose()
		}
	}, [setCanvas, setHistoryLocked, initialSvg])

	return <canvas width="500" height="740" ref={canvasEl} className="border" />
}
