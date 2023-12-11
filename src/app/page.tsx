import ColorSelector from '@/features/fabric/components/ColorSelector'
import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'
import OtherSelector from '@/features/fabric/components/OtherSelector'

export default function Home() {
	return (
		<main>
			<ColorSelector />
			<ObjectSelector />
			<OtherSelector />
			<FabricCanvasWrapper />
		</main>
	)
}
