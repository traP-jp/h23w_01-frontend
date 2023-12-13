import { OperationType } from '@/features/fabric/useHistory'
import { atom } from 'jotai'

export interface History {
	id: string
	json: string
	name: string | null
	operation: OperationType
	time: Date
}

export const historiesAtom = atom<History[]>([])
export const undoingAtom = atom(false)
