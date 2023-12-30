export const datetimeToString = (date: Date): string => {
	date.setHours(date.getHours() + 9)
	return `${date.getFullYear()}/${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
		.getHours()
		.toString()
		.padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export const timeToString = (date: Date): string => {
	date.setHours(date.getHours() + 9)
	return `${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}
