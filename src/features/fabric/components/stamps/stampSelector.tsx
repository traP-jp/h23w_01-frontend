'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { stamp } from '@/features/traq/stamps'
import { getMatchedStampsWithPriority } from './util'

export default function StampSelector({ stamps }: { stamps: stamp[] }) {
	const [selectedStamps, setSelectedStamp] = useState<stamp[]>([])

	return (
		<>
			<Input
				type="text"
				placeholder="スタンプを検索"
				onChange={e => {
					const query = e.target.value.toLowerCase()
					setSelectedStamp(getMatchedStampsWithPriority(stamps, query))
				}}
				className="flex my-4"
			/>
			<div className="flex flex-wrap">
				{selectedStamps.map(stamp => (
					<button key={stamp.name} className="w-[60px] h-[60px] mr-1 mb-1">
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
