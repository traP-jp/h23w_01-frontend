import ColorSelector from '@/features/fabric/components/ColorSelector'
import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import History from '@/features/fabric/components/History'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'
import OtherSelector from '@/features/fabric/components/OtherSelector'
import { PostForm } from '@/features/form/Form'

export default function Home() {
	return (
		<main className="flex gap-12 pt-8 px-10">
			<div className="space-y-8 flex-1">
				<ColorSelector />
				<ObjectSelector />
				<OtherSelector />
			</div>
			<div>
				<FabricCanvasWrapper />
			</div>
			<div className="flex flex-col justify-between flex-1">
				<History />
				<PostForm />
			</div>
		</main>
	)
}
