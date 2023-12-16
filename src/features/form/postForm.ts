import { getApiOrigin } from '@/lib/env'
import { canvasAtom, imagesAtoms } from '@/states/canvas'
import { userNamesAtom } from '@/states/users'
import { useAtomValue } from 'jotai'

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
	const userNames = useAtomValue(userNamesAtom)

	const postForm = async (form: form, isPatch: boolean) => {
		if (canvas === null) {
			return
		}
		const method = isPatch ? 'PATCH' : 'POST'

		const userUUID = userNames.get(form.ownerId)
		if (!userUUID) {
			console.error(userUUID)
			throw new Error('invalid user id')
		}

		const data: PostFormData = {
			owner_id: userUUID,
			publish_date: form.publishDate,
			publish_channels: form.publishChannels,
			message: form.message,
			images: images.map(image => image.id)
		}
		// カードの情報を送信
		const cardRes = await fetch(`${getApiOrigin()}/cards`, {
			method: method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		if (!cardRes.ok) {
			throw new Error('Failed to post form')
		}
		const cardId = await cardRes.text()

		const promises = []

		// svgを送信するpromiseを作成
		const svgBlob = new Blob([canvas.toSVG({}, svg => svg)], {
			type: 'image/svg+xml'
		})
		promises.push(
			fetch(`${getApiOrigin()}/cards/${cardId}/svg`, {
				method: 'POST',
				headers: {
					'Content-Type': 'image/svg+xml'
				},
				body: svgBlob
			})
		)

		// imgを送信するpromiseを作成
		const imgBlob = new Blob([canvas.toDataURL()], {
			type: 'image/png'
		})
		promises.push(
			fetch(`${getApiOrigin()}/cards/${cardId}/png`, {
				method: method,
				headers: {
					'Content-Type': 'image/png'
				},
				body: imgBlob
			})
		)

		// 埋め込まれている画像を送信するpromiseを作成
		for (const image of images) {
			const data = new FormData()
			data.append('id', image.id)
			data.append('image', image.src)
			promises.push(
				fetch(`${getApiOrigin()}/images`, {
					method: 'POST',
					body: data
				})
			)
		}

		await Promise.all(promises)
	}

	return { postForm }
}
