'use client'

import { selectedChannelsAtom } from '@/states/channels'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useAtomValue } from 'jotai'
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

import { getChannels } from '@/features/traq/channels'
import { canvasAtom } from '@/states/canvas'
import {
	FormSchemaType,
	channelsMax,
	formSchema,
	messageLengthMax
} from './formSchema'
import { usePostForm } from './postForm'
import { SelectedChannelsList } from './selectedChannelsList'

export function PostForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [selectedChannels, setSelectedChannels] = useAtom(selectedChannelsAtom)
	const canvas = useAtomValue(canvasAtom)
	const { postForm } = usePostForm()

	const nextYear = new Date().getFullYear() + 1

	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendDateTime: new Date(`${nextYear}-01-01T00:00:00`),
			sendChannels: [],
			message: ''
		}
	})

	const channelsList = getChannels()

	function onSubmit(values: FormSchemaType) {
		if (canvas === null) {
			return
		}
		postForm({
			publish_date: values.sendDateTime.toISOString(),
			publish_channels: values.sendChannels,
			message: values.message ? values.message : null
		})
		form.reset()
		setSelectedChannels([])
		toast({
			title: '📨',
			description: '手紙を送信しました'
		})
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
								{channelsList
									.filter(channel => !selectedChannels.includes(channel.name))
									.map(channel => (
										<CommandItem
											key={channel.id}
											value={channel.name}
											onSelect={() => {
												setSelectedChannels([...selectedChannels, channel.name])
												form.setValue('sendChannels', [
													...selectedChannels,
													channel.name
												])
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
