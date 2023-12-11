import { Canvas } from 'fabric'
import { atom } from 'jotai'

export const canvasAtom = atom<Canvas | null>(null)

interface Image {
	id: string
	src: File
}
export const imagesAtoms = atom<Image[]>([])
