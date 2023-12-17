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
	const id = formData.get('id')
	const body = formData.get('body')
	if (
		url === null ||
		contentType === null ||
		method === null ||
		body === null
	) {
		throw new Error('Failed to fetch data')
	}
	const formData2 = new FormData()
	if (id !== null) {
		formData2.append('id', id)
		formData2.append('image', body)
	}

	const res = await fetch(url.toString(), {
		method: method.toString(),
		headers:
			id !== null
				? {
						cookie: `${cookieList.map(c => `${c.name}=${c.value}`).join('; ')}`
				  }
				: {
						'Content-Type': contentType.toString(),
						cookie: `${cookieList.map(c => `${c.name}=${c.value}`).join('; ')}`
				  },
		body: id !== null ? formData2 : body,
		credentials: 'include'
	})
	if (!res.ok) {
		console.error(res)
		throw new Error('Failed to fetch data')
	}

	const data = await res.text()

	return NextResponse.json({ res: data })
}
