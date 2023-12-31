import Provider from '@/components/Provider'
import Sidebar from '@/components/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { SHOWCASE_USER_KEY } from '@/lib/auth'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'postQard',
	description: 'Qardを作って共有しよう'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const userId = headers().get(SHOWCASE_USER_KEY)
	if (userId === null) {
		throw new Error('user id is null')
	}
	return (
		<html lang="ja">
			<body className={inter.className}>
				<div className="flex">
					<Sidebar userId={userId} />
					<Provider>{children}</Provider>
				</div>
				<Toaster />
			</body>
		</html>
	)
}
