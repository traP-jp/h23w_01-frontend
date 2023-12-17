'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { DashboardIcon, Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ userId }: { userId: string }) {
	const pathname = usePathname()

	return (
		<div className="w-20 px-4 py-2 h-screen bg-kaga-red flex flex-col">
			<Link href="/" className="w-full flex justify-center" title="新規作成">
				<Pencil2Icon
					className={cn(
						'w-5/6 my-2 py-2 text-white rounded-full',
						pathname === '/' && 'bg-white text-kaga-red'
					)}
					width={30}
					height={40}
				/>
			</Link>
			<Link
				href="/cards"
				className="w-full flex justify-center"
				title="Qard一覧"
			>
				<DashboardIcon
					className={cn(
						'w-5/6 my-2 py-2 text-white rounded-full',
						pathname === '/cards' && 'bg-white text-kaga-red'
					)}
					width={30}
					height={40}
				/>
			</Link>
			<Avatar title={`@${userId}`} className="pb-2 pt-auto mt-auto">
				<AvatarImage
					src={`https://q.trap.jp/api/v3/public/icon/${userId}`}
					className="rounded-full"
				/>
				<AvatarFallback>U</AvatarFallback>
			</Avatar>
		</div>
	)
}
