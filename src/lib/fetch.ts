import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export async function fetcher(url: string, cookies: RequestCookie[]) {
	return fetch(url, {
		mode: 'cors',
		next: {
			revalidate: 3600
		},
		headers: {
			cookie: `${cookies.map(c => `${c.name}=${c.value}`).join('; ')}`
		}
	})
}
