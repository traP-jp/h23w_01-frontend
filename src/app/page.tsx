import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'

export default function Home() {
	return (
		<main>
			<ObjectSelector />
			<FabricCanvasWrapper />
		</main>
	)
}
