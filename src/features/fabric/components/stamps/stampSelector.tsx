'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { stamp } from '@/features/traq/stamps'
import { getMatchedStampsWithPriority } from './util'
import { useSetAtom, useAtom } from 'jotai'
import { selectedToolAtom, selectedStampAtom } from '@/states/tools'

export default function StampSelector({ stamps }: { stamps: stamp[] }) {
	const [selectedStamps, setSelectedStamps] = useState<stamp[]>([])
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
						key={stamp.name}
						className={'w-[60px] h-[60px] mr-1 mb-1 '.concat(
							selectedStamp?.name === stamp.name
								? 'border-2 border-kaga-blue'
								: ''
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
