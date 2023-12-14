import ColorSelector from '@/features/fabric/components/ColorSelector'
import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import History from '@/features/fabric/components/History'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'
import OtherSelector from '@/features/fabric/components/OtherSelector'
import { PostForm } from '@/features/form/Form'
import { fetchChannels } from '@/features/traq/channels'
import { SHOWCASE_USER_KEY } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function Home() {
	const headerList = headers()
	const userId = headerList.get(SHOWCASE_USER_KEY) ?? 'mehm8128'
	const channels = await fetchChannels()

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
				<PostForm userId={userId} channels={channels} />
			</div>
		</main>
	)
}
