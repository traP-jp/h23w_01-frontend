import { Canvas } from 'fabric'
import { atom } from 'jotai'

export const canvasAtom = atom<Canvas | null>(null)
