import { createContext } from 'react-router'

export type UserContext = {
	id?: number,
	name: string,
}

export const userContext = createContext<UserContext | null>(null)
