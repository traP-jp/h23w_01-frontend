'use client'

import { selectedToolAtom } from '@/states/tools'
import { ImageIcon, TextIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'

export type OtherTool = 'text' | 'image'
export const otherTools = [
	{
		name: '文字',
		value: 'text',
		icon: <TextIcon width={32} height={32} />
	},
	{
		name: '画像',
		value: 'image',
		icon: <ImageIcon width={32} height={32} />
	}
] as const

export default function OtherSelector() {
	const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom)

	const handleToolClick = (tool: OtherTool) => {
		if (tool === selectedTool) {
			setSelectedTool(null)
			return
		}

		switch (tool) {
			case 'text':
				setSelectedTool('text')
				break
			case 'image':
				setSelectedTool('image')
				break
			default:
				throw new Error(`invalid tool: ${tool satisfies never}`)
		}
	}

	return (
		<div className="space-y-2">
			<div>その他</div>
			<div className="flex gap-3">
				{otherTools.map(tool => (
					<button
						onClick={() => handleToolClick(tool.value)}
						key={tool.value}
						className={`rounded-full flex flex-col gap-1 items-center py-2 border-2 border-kaga-yellow w-20 h-20${
							tool.value === selectedTool ? ' bg-kaga-yellow text-white' : ''
						}`}
					>
						{tool.icon}
						{tool.name}
					</button>
				))}
			</div>
		</div>
	)
}
