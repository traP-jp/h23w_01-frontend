import { ObjectType } from '@/features/fabric/useObject'
import { Stamp } from '@/features/traq/stamps'
import { atom } from 'jotai'

export type Tool = 'object' | 'text' | 'image' | 'stamp' | null

export const selectedToolAtom = atom<Tool>(null)

export const selectObjectAtom = atom<ObjectType | null>(null)

export const selectedColorAtom = atom<string>('#000000')

export const selectedInnerColorAtom = atom<string>('#000000')

export const selectedCanvasColorAtom = atom<string>('#FFFFFF')

export const selectedStampAtom = atom<Stamp | null>(null)
