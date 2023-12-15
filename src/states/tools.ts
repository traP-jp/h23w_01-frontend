import { ObjectType } from '@/features/fabric/useObject'
import { atom } from 'jotai'

export type Tool = 'object' | 'text' | 'image' | null

export const selectedToolAtom = atom<Tool>(null)

export const selectObjectAtom = atom<ObjectType | null>(null)

export const selectedColorAtom = atom<string>('#000000')

export const selectedInnerColorAtom = atom<string>('#000000')

export const selectedCanvasColorAtom = atom<string>('#FFFFFF')
