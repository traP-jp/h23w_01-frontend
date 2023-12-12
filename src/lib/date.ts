export const datetimeToString = (date: Date): string => {
	return `${date.getFullYear()}/${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
		.getHours()
		.toString()
		.padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
		.getSeconds()
		.toString()
		.padStart(2, '0')}`
}
