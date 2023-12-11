'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
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
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons'

import { getChannels } from '@/features/traq/channels'
import { postForm } from './PostForm'

const formSchema = z.object({
	sendDateTime: z.string(),
	sendChannels: z
		.array(z.string(), { required_error: 'チャンネルを指定してください' })
		.min(1, { message: 'チャンネルを指定してください' })
		.max(3, { message: 'チャンネルは3つまで指定できます' }),
	message: z
		.string({
			required_error: 'メッセージを入力してください。'
		})
		.min(1, { message: 'メッセージを入力してください。' })
		.max(100, { message: 'メッセージは100文字以内で入力してください。' })
})

export function PostForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [selectedChannels, setSelectedChannels] = useState<string[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendDateTime: new Date().toISOString().slice(0, 16),
			sendChannels: [],
			message: ''
		}
	})

	const channelsList = getChannels()

	function onSubmit(values: z.infer<typeof formSchema>) {
		postForm({
			sendDateTime: values.sendDateTime,
			sendChannels: values.sendChannels,
			message: values.message
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
								<Input type="datetime-local" {...field} />
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
