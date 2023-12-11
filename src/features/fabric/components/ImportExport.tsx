'use client'

import { canvasAtom } from '@/states/canvas'
import { FabricObject, loadSVGFromString } from 'fabric'
import { useAtomValue } from 'jotai'

export default function FabricCanvasWrapper() {
	const canvas = useAtomValue(canvasAtom)

	const handleImport = async () => {
		const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="500" height="740" viewBox="0 0 500 740" xml:space="preserve">
<desc>Created with Fabric.js 6.0.0-beta16</desc>
<defs>
</defs>
<g transform="matrix(1 0 0 1 128.5 90.5)"  >
<polygon style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  points="-50,50 0,-50 50,50 " />
</g>
<g transform="matrix(1 0 0 1 304.5 147.5)"  >
<rect style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  x="-50" y="-50" rx="0" ry="0" width="100" height="100" />
</g>
<g transform="matrix(1 0 0 1 77.5 210.5)"  >
<circle style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" r="50" />
</g>
<g transform="matrix(1 0 0 1 276.5 352.5345)" style=""  >
		<text xml:space="preserve" font-family="Times New Roman" font-size="20" font-style="normal" font-weight="normal" style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-70" y="6.2828" >テキストを入力</tspan></text>
</g>
<g transform="matrix(1 0 0 1 195 540)"  >
<clipPath id="imageCrop_1">
	<rect x="-50" y="-50" width="100" height="100" />
</clipPath>
	<image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="https://q.trap.jp/api/v3/public/icon/mehm8128" x="-50" y="-50" width="128" height="128" clip-path="url(#imageCrop_1)" ></image>
</g>
</svg>`
		if (!canvas) return
		const objectArray: FabricObject[] = []
		await loadSVGFromString(svg, (_, object) => {
			objectArray.push(object)
		})
		for (const object of objectArray) {
			canvas.add(object)
		}
	}
	const handleExport = () => {
		if (!canvas) return
		console.log(canvas.toSVG({}, svg => svg))
	}

	return (
		<div>
			<button onClick={handleImport}>import</button>
			<button onClick={handleExport}>export</button>
		</div>
	)
}
