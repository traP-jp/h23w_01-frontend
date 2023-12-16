import { Label } from '@/components/ui/label'
import { fetchAllStamps } from '@/features/traq/stamps'
import StampSelector from './StampSelector'
import { cookies } from 'next/headers'

export default async function StampSelectorWrapper() {
	const stamps = await fetchAllStamps(cookies().getAll())
	return (
		<>
			<div>
				<Label htmlFor="stampsSelector">スタンプ</Label>
				<div id="stampsSelector">
					<StampSelector stamps={stamps} />
				</div>
			</div>
		</>
	)
}
