import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import { CardType } from '@/features/card/type'
import { datetimeToString } from '@/lib/date'
import Image from 'next/image'
import CardActionButtons from './CardActionButtons'

export default function Card({
	card,
	usersMap,
	meId,
	channelMap
}: {
	card: CardType
	usersMap: Map<string, string>
	meId: string | null
	channelMap: Map<string, string>
}) {
	return (
		<HoverCard openDelay={500}>
			<HoverCardTrigger className="w-[180px] border shadow-md">
				<Image
					src={`/api/img/cards/${card.id}`}
					width={300}
					height={444}
					alt={`${datetimeToString(
						new Date(card.publish_date)
					)}に送信予定のカード`}
				/>
			</HoverCardTrigger>
			<HoverCardContent
				className="flex p-7 gap-14"
				side="right"
				sideOffset={-20}
			>
				<Image
					src={`/api/img/cards/${card.id}`}
					width={300}
					height={444}
					className="border w-[240px]"
					alt={`${datetimeToString(
						new Date(card.publish_date)
					)}に送信予定のカード`}
				/>
				<div className="flex flex-col justify-between">
					<div className="space-y-4">
						<div>
							<p>送信日時</p>
							<p className="ml-4">
								{datetimeToString(new Date(card.publish_date))}
							</p>
						</div>
						<div>
							<p>送信者</p>
							<p className="ml-4">
								{usersMap.get(card.owner_id) ?? '不明なユーザー'}
							</p>
						</div>
						<div>
							<p>送信先</p>
							<p className="ml-4">
								#
								{card.publish_channels
									.map(channel => channelMap.get(channel) ?? '不明なチャンネル')
									.join(', ')}
							</p>
						</div>
						<div>
							<p>メッセージ</p>
							<p className="ml-4">{card.message}</p>
						</div>
					</div>
					{usersMap.get(card.owner_id) === meId && (
						<CardActionButtons id={card.id} />
					)}
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
