'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAtom } from 'jotai'
import { selectedChannelsAtom } from '@/states/channels'

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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import { SelectedChannelsList } from './selectedChannelsList'
import { getChannels } from '@/features/traq/channels'
import { postForm } from './postForm'
import { channelsMax, formSchema, messageLengthMax } from './formSchema'

export function PostForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [selectedChannels, setSelectedChannels] = useAtom(selectedChannelsAtom)

	const nextYear = new Date().getFullYear() + 1

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendDateTime: new Date(`${nextYear}-01-01T00:00:00`),
			sendChannels: [],
			message: ''
		}
	})

	const channelsList = getChannels()

	function onSubmit(values: z.infer<typeof formSchema>) {
		postForm({
			sendDateTime: values.sendDateTime.toISOString(),
			sendChannels: values.sendChannels,
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
							<FormItem>
								<FormLabel>送信日時</FormLabel>
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
										// ↑動くけどエラーが出る
										// Warning: Prop `min` did not match. Server: "2023-12-12T16:45" Client: "2023-12-12T23:58"
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
							className="w-[200px] justify-between"
							disabled={selectedChannels.length >= channelsMax}
						>
							チャンネル <ChevronDownIcon />
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
						<FormItem>
							<FormLabel>メッセージ</FormLabel>
							<FormControl>
								<Textarea {...field} maxLength={100} />
							</FormControl>
							<div
								className={
									field.value
										? field.value.length <= messageLengthMax
											? 'text-red-500'
											: ''
										: ''
								}
							>
								{field.value?.length}/100
							</div>
						</FormItem>
					)}
				/>

				<Button type="submit">保存</Button>
			</form>
			<Button onClick={() => console.log(form.getValues())}>リセット</Button>
		</Form>
	)
}
