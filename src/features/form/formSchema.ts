import { z } from 'zod'

const channelsMax = 3
const messageLengthMax = 100

const formSchema = z.object({
	sendDateTime: z.coerce.date().min(new Date(), {
		message: '過去の日時は指定できません。'
	}),
	sendChannels: z
		.array(z.string(), { required_error: 'チャンネルを指定してください' })
		.min(1, { message: 'チャンネルを指定してください' })
		.max(channelsMax, { message: 'チャンネルは3つまで指定できます' }),
	message: z
		.string()
		.max(messageLengthMax, {
			message: 'メッセージは100文字以内で入力してください。'
		})
		.optional()
})

export { channelsMax, messageLengthMax, formSchema }
