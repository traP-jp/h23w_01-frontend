import { http, HttpResponse, RequestHandler } from 'msw'

import { getApiOrigin } from '@/lib/env'

export const getHandlersArray = (
	handlers: Record<string, () => RequestHandler>
): RequestHandler[] => {
	return Object.values(handlers).map(handler => handler())
}

const handlers = (apiOrigin: string) => {
	return [
		http.get('/api/oisu-', () => {
			return HttpResponse.json('oisu-')
		})
	].flat()
}

export const initMock = async () => {
	if (process.env.NODE_ENV === 'development') {
		if (typeof window !== 'undefined') {
			const setupWorker = await import('msw/browser').then(m => m.setupWorker)
			const worker = setupWorker(...handlers(getApiOrigin()))
			await worker.start({
				onUnhandledRequest(req, print) {
					if (req.url.startsWith('/_next')) {
						return
					}
					print.warning()
				}
			})
		} else {
			const setupServer = await import('msw/node').then(m => m.setupServer)
			const server = setupServer(...handlers(getApiOrigin()))
			server.listen()
		}
	}
}
