import { z } from 'zod'

const CHANNELS_MAX = 3
const MESSAGE_LENGTH_MAX = 100

const formSchema = z.object({
	sendDateTime: z.coerce.date().min(new Date(), {
		message: '過去の日時は指定できません。'
	}),
	sendChannels: z
		.array(z.string(), { required_error: 'チャンネルを指定してください' })
		.min(1, { message: 'チャンネルを指定してください' })
		.max(CHANNELS_MAX, { message: 'チャンネルは3つまで指定できます' }),
	message: z.string().max(MESSAGE_LENGTH_MAX, {
		message: 'メッセージは100文字以内で入力してください。'
	})
})

export type FormSchemaType = z.infer<typeof formSchema>

export {
	CHANNELS_MAX as channelsMax,
	MESSAGE_LENGTH_MAX as messageLengthMax,
	formSchema
}
