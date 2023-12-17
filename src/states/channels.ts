import { Channel } from '@/features/traq/channels'
import { atom } from 'jotai'

export const selectedChannelsAtom = atom<Channel[]>([])
