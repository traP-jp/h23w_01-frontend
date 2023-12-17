import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export interface RequestBody {
	method: 'POST' | 'PATCH' | 'DELETE'
	url: string
	// biome-ignore lint/suspicious/noExplicitAny: any
	body?: any
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	const cookieStore = cookies()
	const cookieList = cookieStore.getAll()
	const requestBody: RequestBody = await req.json()

	const res = await fetch(requestBody.url, {
		method: requestBody.method,
		headers: {
			'Content-Type': 'application/json',
			cookie: `${cookieList.map(c => `${c.name}=${c.value}`).join('; ')}`
		},
		body: JSON.stringify(requestBody.body),
		credentials: 'include'
	})
	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}

	const data = await res.text()

	return NextResponse.json({ res: data })
}
