import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export interface RequestBody {
	method: 'POST' | 'PATCH' | 'DELETE'
	url: string
	// biome-ignore lint/suspicious/noExplicitAny: any
	body?: any
}

export async function POST(req: Request): Promise<NextResponse> {
	const cookieStore = cookies()
	const cookieList = cookieStore.getAll()
	const formData = await req.formData()
	const url = formData.get('url')
	const contentType = formData.get('contentType')
	const method = formData.get('method')
	const body = formData.get('body')
	if (
		url === null ||
		contentType === null ||
		method === null ||
		body === null
	) {
		throw new Error('Failed to fetch data')
	}

	const res = await fetch(url.toString(), {
		method: method.toString(),
		headers: {
			'Content-Type': contentType.toString(),
			cookie: `${cookieList.map(c => `${c.name}=${c.value}`).join('; ')}`
		},
		body: body,
		credentials: 'include'
	})
	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}

	const data = await res.text()

	return NextResponse.json({ res: data })
}
