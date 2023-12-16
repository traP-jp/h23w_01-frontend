import { atom } from 'jotai'

// Map<userID, userUUID>
export const userNamesAtom = atom<Map<string, string>>(new Map())

// Map<userUUID, userID>
export const usersUUIDAtom = atom<Map<string, string>>(new Map())
