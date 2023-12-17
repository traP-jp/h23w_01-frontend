import CanvasColorSelector from '@/features/fabric/components/CanvasColorSelector'
import ColorSelector from '@/features/fabric/components/ColorSelector'
import FabricCanvasWrapper from '@/features/fabric/components/FabricCanvas'
import History from '@/features/fabric/components/History'
import InnerColorSelector from '@/features/fabric/components/InnerColorSelector'
import ObjectSelector from '@/features/fabric/components/ObjectSelector'
import OtherSelector from '@/features/fabric/components/OtherSelector'
import StampSelectorWrapper from '@/features/fabric/components/stamps/StampSelectorWrapper'
import { PostForm } from '@/features/form/Form'
import { fetchChannels } from '@/features/traq/channels'
import { fetchUsers } from '@/features/traq/users'
import { SHOWCASE_USER_KEY } from '@/lib/auth'
import { cookies, headers } from 'next/headers'

export default async function Home() {
	const headerList = headers()
	const userId = headerList.get(SHOWCASE_USER_KEY)
	const cookieStore = cookies()
	const cookieList = cookieStore.getAll()
	const channels = await fetchChannels(cookieList)
	const usersMap = new Map(
		(await fetchUsers(cookieList)).map(user => [user.name, user.id])
	)

	return (
		<main className="flex gap-12 pt-8 px-2 w-full">
			<div className="space-y-8 flex-1">
				<div className="flex gap-2">
					<ColorSelector />
					<InnerColorSelector />
					<CanvasColorSelector />
				</div>
				<ObjectSelector />
				<OtherSelector />
				<StampSelectorWrapper />
			</div>
			<div>
				<FabricCanvasWrapper cookies={cookieList} />
			</div>
			<div className="flex flex-col justify-between flex-1">
				<History />
				<PostForm
					userId={userId}
					channels={channels}
					usersMap={usersMap}
					cookies={cookieList}
				/>
			</div>
		</main>
	)
}
