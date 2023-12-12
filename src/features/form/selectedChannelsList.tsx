import { useAtom } from 'jotai'
import { selectedChannelsAtom } from '@/states/channels'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Cross1Icon } from '@radix-ui/react-icons'

export function SelectedChannelsList() {
	const [selectedChannels, setSelectedChannels] = useAtom(selectedChannelsAtom)

	const makeChannelsList = () => {
		return selectedChannels.map(channel => {
			const id = `cancel-${channel}`
			return (
				<li key={channel}>
					<Label htmlFor={id}>#{channel}</Label>{' '}
					<Button
						onClick={() => {
							setSelectedChannels(selectedChannels.filter(c => c !== channel))
						}}
						variant="outline"
						size="sm"
						id={id}
					>
						<Cross1Icon />
					</Button>
				</li>
			)
		})
	}

	return (
		<>
			<Label>送信先チャンネル</Label>
			<ul>{makeChannelsList()}</ul>
		</>
	)
}
