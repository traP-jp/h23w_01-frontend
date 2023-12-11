import { ObjectType } from '@/features/fabric/useObject'
import { atom } from 'jotai'

export type Tool = 'object' | null

export const selectedToolAtom = atom<Tool>(null)

export const selectObjectAtom = atom<ObjectType | null>(null)
