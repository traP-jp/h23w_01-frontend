'use client'

import { selectedChannelsAtom } from '@/states/channels'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import { Channel } from '@/features/traq/channels'
import {
	FormSchemaType,
	channelsMax,
	formSchema,
	messageLengthMax
} from './formSchema'
import { usePostForm } from './postForm'
import { SelectedChannelsList } from './selectedChannelsList'

export function PostForm({
	userId,
	initialValue,
	channels,
	usersMap,
	cardId
}: {
	userId: string | null
	initialValue?: FormSchemaType
	channels: Channel[]
	usersMap: Map<string, string>
	cardId?: string
}) {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [selectedChannels, setSelectedChannels] = useAtom(selectedChannelsAtom)
	const { postForm } = usePostForm()

	const nextYear = new Date().getFullYear() + 1

	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues:
			initialValue !== undefined
				? {
						...initialValue,
						message: initialValue.message ?? ''
				  }
				: {
						sendDateTime: new Date(`${nextYear}-01-01T00:00:00`),
						sendChannels: [],
						message: ''
				  }
	})

	async function onSubmit(values: FormSchemaType) {
		if (userId === null) {
			throw new Error('userId is null')
		}
		const userUUID = usersMap.get(userId)
		if (userUUID === undefined) {
			console.error('user does not exist.', userId)
			throw new Error('userUUID is undefined')
		}
		try {
			await postForm(
				{
					ownerId: userUUID,
					publishDate: values.sendDateTime.toISOString(),
					publishChannels: values.sendChannels,
					message: values.message ? values.message : null
				},
				initialValue !== undefined,
				cardId
			)
			form.reset()
			setSelectedChannels([])
			toast({
				title: '📨',
				description: '手紙を送信しました'
			})
		} catch {
			toast({
				title: 'error',
				description: '手紙の送信に失敗しました'
			})
		}
	}

	const timezoneOffset = new Date().getTimezoneOffset() * 60000 // get timezone offset in milliseconds

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="sendDateTime"
					render={({ field }) => {
						const localISOTime = new Date(
							field.value.valueOf() - timezoneOffset
						)
							.toISOString()
							.slice(0, 16)
						return (
							<FormItem className="my-4">
								<FormLabel>
									送信日時 <span className="text-red-500 text-sm">(必須)</span>
								</FormLabel>
								<FormControl>
									<Input
										type="datetime-local"
										onChange={e => {
											form.setValue('sendDateTime', new Date(e.target.value))
										}}
										value={localISOTime}
										min={new Date(new Date().valueOf() - timezoneOffset)
											.toISOString()
											.slice(0, 16)}
										className={field.value < new Date() ? 'bg-red-500' : ''}
									/>
								</FormControl>
							</FormItem>
						)
					}}
				/>
				<SelectedChannelsList />
				<Popover
					open={open && selectedChannels.length < channelsMax}
					onOpenChange={setOpen}
				>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="w-[100%] justify-end"
							disabled={selectedChannels.length >= channelsMax}
						>
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<Command>
							<CommandInput />
							<CommandList>
								{channels
									.filter(
										channel =>
											!selectedChannels
												.map(channel => channel.id)
												.includes(channel.id)
									)
									.map(channel => (
										<CommandItem
											key={channel.id}
											value={channel.name}
											onSelect={() => {
												setSelectedChannels(selectedChannels.concat(channel))
												form.setValue(
													'sendChannels',
													selectedChannels
														.map(channel => channel.id)
														.concat([channel.id])
												)
											}}
											disabled={selectedChannels.length >= channelsMax}
										>
											#{channel.name}
										</CommandItem>
									))}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem className="my-4">
							<FormLabel>メッセージ</FormLabel>
							<FormControl>
								<Input {...field} maxLength={messageLengthMax} />
							</FormControl>
							<div
								className={
									field.value
										? field.value.length > messageLengthMax
											? 'text-red-500 text-right'
											: 'text-right'
										: 'text-right'
								}
							>
								{field.value?.length}/100
							</div>
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit">保存</Button>
				</div>
			</form>
		</Form>
	)
}
