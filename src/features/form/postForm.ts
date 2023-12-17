import { RequestBody } from '@/app/api/json/route'
import { getApiOrigin } from '@/lib/env'
import { canvasAtom, imagesAtoms } from '@/states/canvas'
import { useAtomValue } from 'jotai'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export type form = {
	ownerId: string
	publishDate: string
	publishChannels: string[]
	message: string | null
}

interface PostFormData {
	owner_id: string
	publish_date: string
	publish_channels: string[]
	message: string | null
	images: string[]
}

export const usePostForm = () => {
	const canvas = useAtomValue(canvasAtom)
	const images = useAtomValue(imagesAtoms)

	const postForm = async (
		form: form,
		isPatch: boolean,
		cookies: RequestCookie[]
	) => {
		if (canvas === null) {
			return
		}
		const method = isPatch ? 'PATCH' : 'POST'

		const data: PostFormData = {
			owner_id: form.ownerId,
			publish_date: form.publishDate,
			publish_channels: form.publishChannels,
			message: form.message,
			images: images.map(image => image.id)
		}
		// カードの情報を送信
		const cardRes = await fetch('/api/json', {
			method: 'POST',
			body: JSON.stringify({
				url: `${getApiOrigin()}/cards`,
				method: method,
				body: data
			} satisfies RequestBody)
		})

		if (!cardRes.ok) {
			throw new Error('Failed to post form')
		}
		const cardId = (await cardRes.json()).res

		const promises = []

		// svgを送信するpromiseを作成
		const svg = canvas
			.toSVG({}, svg => svg)
			.replace('https://h23w-01-frontend.trap.show', getApiOrigin())
		const svgBlob = new Blob([svg], {
			type: 'image/svg+xml'
		})
		const svgData = new FormData()
		svgData.append('url', `${getApiOrigin()}/cards/${cardId}/svg`)
		svgData.append('contentType', 'image/svg+xml')
		svgData.append('method', method)
		svgData.append('body', svgBlob)
		promises.push(
			fetch('/api/formData', {
				method: 'POST',
				body: svgData
			})
		)

		// imgを送信するpromiseを作成
		const imgBlob = new Blob([canvas.toDataURL()], {
			type: 'image/png'
		})
		const imgData = new FormData()
		imgData.append('url', `${getApiOrigin()}/cards/${cardId}/png`)
		imgData.append('contentType', 'image/png')
		imgData.append('method', method)
		imgData.append('body', imgBlob)
		promises.push(
			fetch('/api/formData', {
				method: 'POST',
				body: imgData
			})
		)

		// 埋め込まれている画像を送信するpromiseを作成
		for (const image of images) {
			const data = new FormData()
			data.append('url', `${getApiOrigin()}/images`)
			data.append('contentType', 'image/png')
			data.append('method', method)
			data.append('id', image.id)
			data.append('body', image.src)
			promises.push(
				fetch('/api/formData', {
					method: 'POST',
					body: data
				})
			)
		}

		await Promise.all(promises)
	}

	return { postForm }
}
