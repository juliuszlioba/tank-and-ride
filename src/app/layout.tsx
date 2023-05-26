import './globals.css'
import { Josefin_Sans } from 'next/font/google'

import Login from './login'

const josefin_sans = Josefin_Sans({
	subsets: ['latin'],
	variable: '--font-josefin_sans',
})

export const metadata = {
	title: 'Tank and Ride',
	description: 'Tank and ride Website',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${josefin_sans.className} bg-gray-950 text-gray-200`}>
				{children}
				<div className="flex justify-center gap-2 py-12">
					{/* @ts-expect-error next version of TS will fix this */}
					<Login />
				</div>
			</body>
		</html>
	)
}
