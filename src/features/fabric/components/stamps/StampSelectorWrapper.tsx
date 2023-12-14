import { Label } from '@/components/ui/label'
import { getAllStamps } from '@/features/traq/stamps'
import StampSelector from './stampSelector'

export default async function StampSelectorWrapper() {
	const stamps = await getAllStamps()
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
