import { useAtom } from 'jotai'
import { selectedChannelsAtom } from '@/states/channels'
import { Label } from '@/components/ui/label'
import { Cross1Icon } from '@radix-ui/react-icons'

export function SelectedChannelsList() {
	const [selectedChannels, setSelectedChannels] = useAtom(selectedChannelsAtom)

	const makeChannelsList = () => {
		return selectedChannels.map(channel => {
			return (
				<li key={channel} className="flex justify-between items-center my-1">
					<span className="before:content-['・'] before:text-lg">
						#{channel}
					</span>
					<Cross1Icon
						onClick={() => {
							setSelectedChannels(selectedChannels.filter(c => c !== channel))
						}}
						className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 justify-self-end"
					/>
				</li>
			)
		})
	}

	return (
		<>
			<Label>
				送信先チャンネル <span className="text-red-500 text-sm">(必須)</span>
			</Label>
			<ul className="list-disc">{makeChannelsList()}</ul>
		</>
	)
}
