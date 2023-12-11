import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import { datetimeToString } from '@/lib/date'
import Image from 'next/image'
import CardActionButtons from './CardActionButtons'

export interface Channel {
	id: string
	path: string
}

export interface CardType {
	id: string
	publish_date: string
	publish_channels: Channel[]
	message: string
}

export default function Card({ card }: { card: CardType }) {
	return (
		<HoverCard openDelay={500}>
			<HoverCardTrigger className="w-[180px] border">
				<Image
					src="https://www.post.japanpost.jp/img/service/standard/two/type/pic_normal_new_01.jpg"
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
					src="https://www.post.japanpost.jp/img/service/standard/two/type/pic_normal_new_01.jpg"
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
							<p>送信先</p>
							<p className="ml-4">
								{card.publish_channels.map(channel => channel.path).join(', ')}
							</p>
						</div>
						<div>
							<p>メッセージ</p>
							<p className="ml-4">{card.message}</p>
						</div>
					</div>
					<CardActionButtons id={card.id} />
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
