import { Label } from '@/components/ui/label'
import { selectedChannelsAtom } from '@/states/channels'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'

export function SelectedChannelsList() {
	const [selectedChannels, setSelectedChannels] = useAtom(selectedChannelsAtom)

	const makeChannelsList = () => {
		return selectedChannels.map(channel => {
			return (
				<li key={channel.id} className="flex justify-between items-center my-1">
					<span className="before:content-['・'] before:text-lg">
						#{channel.name}
					</span>
					<button
						type="button"
						onClick={() => {
							setSelectedChannels(selectedChannels.filter(c => c !== channel))
						}}
					>
						<Cross1Icon className="w-4 h-4 text-red-500 hover:text-red-700 justify-self-end" />
					</button>
				</li>
			)
		})
	}

	return (
		<>
			<Label className="block mb-2">
				送信先チャンネル
				<span className="text-red-500 text-sm">(必須 3つまで)</span>
			</Label>
			<ul className="list-disc">{makeChannelsList()}</ul>
		</>
	)
}
