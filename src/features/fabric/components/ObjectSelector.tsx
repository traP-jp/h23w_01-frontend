'use client'

import { ObjectType, objects } from '@/features/fabric/useObject'
import { selectObjectAtom, selectedToolAtom } from '@/states/tools'
import { useAtom, useSetAtom } from 'jotai'

export default function ObjectSelector() {
	const [selectedObject, setSelctedObject] = useAtom(selectObjectAtom)
	const setSelectedTool = useSetAtom(selectedToolAtom)

	const selectObject = (objectType: ObjectType) => {
		if (objectType === selectedObject) {
			setSelectedTool(null)
			setSelctedObject(null)
			return
		}
		setSelectedTool('object')
		setSelctedObject(objectType)
	}

	return (
		<div className="space-y-2">
			<div>図形</div>
			<div className="flex gap-3">
				{objects.map(object => (
					<button
						onClick={() => selectObject(object.value)}
						key={object.value}
						className={`rounded-full flex flex-col gap-1 items-center py-2 border-2 border-kaga-blue w-20 h-20${
							object.value === selectedObject ? ' bg-kaga-blue text-white' : ''
						}`}
					>
						{object.icon}
						{object.name}
					</button>
				))}
			</div>
		</div>
	)
}
