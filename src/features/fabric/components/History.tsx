'use client'

import { Button } from '@/components/ui/button'
import { operationMap, useHistory } from '@/features/fabric/useHistory'
import { timeToString } from '@/lib/date'

export default function History() {
	const { history, undo } = useHistory()

	return (
		<div className="w-1/3">
			履歴
			<ol className="divide-y-2">
				{history.map(h => (
					<li key={h.id} className="flex items-center justify-between py-1">
						<p className="flex items-center gap-2">
							<time>{timeToString(h.time)}</time>
							<span>
								{h.name}を{operationMap[h.operation]}しました
							</span>
						</p>
						<Button variant="secondary" size="sm" onClick={() => undo(h.id)}>
							戻す
						</Button>
					</li>
				))}
			</ol>
		</div>
	)
}
