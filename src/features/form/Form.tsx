'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ChevronDownIcon, Cross1Icon } from '@radix-ui/react-icons'

import { getChannels } from '@/features/traq/channels'
import { postForm } from './PostForm'

const nextYear = new Date().getFullYear() + 1

const formSchema = z.object({
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

export function PostForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [selectedChannels, setSelectedChannels] = useState<string[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendDateTime: new Date(`${nextYear}-01-01T09:00:00`),
			sendChannels: [],
			message: ''
		}
	})

	const channelsList = getChannels()

	function onSubmit(values: z.infer<typeof formSchema>) {
		postForm({
			sendDateTime: values.sendDateTime.toISOString(),
			sendChannels: values.sendChannels,
			message: values.message ? values.message : ''
		})
		form.reset()
		setSelectedChannels([])
		toast({
			title: '📨',
			description: '手紙を送信しました'
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="sendDateTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>送信日時</FormLabel>
							<FormControl>
								<Input
									type="datetime-local"
									onChange={e => {
										form.setValue('sendDateTime', new Date(e.target.value))
									}}
									value={form.watch('sendDateTime').toISOString().slice(0, -1)}
								/>
							</FormControl>
							<FormDescription>送信日時を指定します。</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="sendChannels"
					render={({ field }) => (
						<FormItem>
							<FormLabel>送信先</FormLabel>
							<FormControl>
								<ul>
									{selectedChannels.map(channel => (
										<li key={channel}>
											<Label key={channel} htmlFor="cancel">
												{channel}
											</Label>
											<Button
												onClick={() => {
													setSelectedChannels(
														selectedChannels.filter(c => c !== channel)
													)
												}}
												variant="outline"
												size="icon"
												id="cancel"
											>
												<Cross1Icon />
											</Button>
										</li>
									))}
								</ul>
							</FormControl>
							<FormDescription>送信先を選択します。</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-[200px] justify-between"
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
								<Textarea {...field} />
							</FormControl>
							<FormDescription>メッセージを入力します。</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">送信</Button>
			</form>
			<Button onClick={() => console.log(form.getValues())}>リセット</Button>
		</Form>
	)
}
