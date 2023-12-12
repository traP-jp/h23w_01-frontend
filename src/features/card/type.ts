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