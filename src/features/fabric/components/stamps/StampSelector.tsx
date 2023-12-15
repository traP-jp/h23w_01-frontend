'use client'
import { Input } from '@/components/ui/input'
import { Stamp } from '@/features/traq/stamps'
import { selectedStampAtom, selectedToolAtom } from '@/states/tools'
import { useAtom, useSetAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import { getMatchedStampsWithPriority } from './util'
import { cn } from '@/lib/utils'

export default function StampSelector({ stamps }: { stamps: Stamp[] }) {
	const [selectedStamps, setSelectedStamps] = useState<Stamp[]>([])
	const [selectedStamp, setSelectedStamp] = useAtom(selectedStampAtom)
	const setSelectedTool = useSetAtom(selectedToolAtom)

	return (
		<>
			<Input
				type="text"
				placeholder="スタンプを検索"
				onChange={e => {
					const query = e.target.value.toLowerCase()
					setSelectedStamps(getMatchedStampsWithPriority(stamps, query))
				}}
				className="flex my-4"
			/>
			<div className="flex flex-wrap overflow-y-auto h-64">
				{selectedStamps.map(stamp => (
					<button
						key={stamp.id}
						className={cn(
							'w-[60px] h-[60px] mr-1 mb-1',
							selectedStamp?.name === stamp.name && 'border-2 border-kaga-blue'
						)}
						onClick={() => {
							setSelectedStamp(stamp)
							setSelectedTool('stamp')
						}}
					>
						<Image
							src={stamp.path}
							alt={stamp.name}
							width={128}
							height={128}
							className="w-full h-full"
						/>
					</button>
				))}
			</div>
		</>
	)
}
