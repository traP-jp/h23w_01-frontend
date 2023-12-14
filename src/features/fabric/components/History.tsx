'use client'

import { Button } from '@/components/ui/button'
import { operationMap, useHistory } from '@/features/fabric/useHistory'
import { timeToString } from '@/lib/date'

export default function History() {
	const { histories, undo } = useHistory()

	return (
		<div className="space-y-2">
			<div>履歴</div>
			<ol className="divide-y-2">
				{histories.map(h => (
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
			{histories.length === 0 && <div>履歴はまだありません。</div>}
		</div>
	)
}
