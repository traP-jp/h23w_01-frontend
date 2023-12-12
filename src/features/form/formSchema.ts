import { z } from 'zod'

export const formSchema = z.object({
	sendDateTime: z.coerce.date().min(new Date(), {
		message: '過去の日時は指定できません。'
	}),
	sendChannels: z
		.array(z.string(), { required_error: 'チャンネルを指定してください' })
		.min(1, { message: 'チャンネルを指定してください' })
		.max(3, { message: 'チャンネルは3つまで指定できます' }),
	message: z
		.string()
		.max(100, { message: 'メッセージは100文字以内で入力してください。' })
		.optional()
})
