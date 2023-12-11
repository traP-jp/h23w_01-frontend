'use client'

import { ObjectType, objects } from '@/features/fabric/useObject'
import { selectObjectAtom } from '@/states/tools'
import { useAtom } from 'jotai'

export default function ObjectSelector() {
	const [selectedObject, setSelctedObject] = useAtom(selectObjectAtom)

	const selectObject = (objectType: ObjectType) => {
		if (objectType === selectedObject) {
			setSelctedObject(null)
			return
		}
		setSelctedObject(objectType)
	}

	return (
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
			{selectedObject}
		</div>
	)
}
