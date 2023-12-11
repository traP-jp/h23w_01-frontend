import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'
import OtherSelector from '@/features/fabric/components/OtherSelector'

export default function Home() {
	return (
		<main>
			<ObjectSelector />
			<OtherSelector />
			<FabricCanvasWrapper />
		</main>
	)
}
