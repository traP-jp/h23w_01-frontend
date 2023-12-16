export const getImageSize = async (file: Blob) => {
	const imgEle = new Image()
	imgEle.src = URL.createObjectURL(file)
	return new Promise<{
		width: number
		height: number
		imgEle: HTMLImageElement
	}>(resolve => {
		imgEle.onload = () => {
			resolve({
				width: imgEle.naturalWidth,
				height: imgEle.naturalHeight,
				imgEle
			})
		}
	})
}
