import './globals.css'
import { Josefin_Sans } from 'next/font/google'

import SupabaseListener from '../components/supabase-listener'
import SupabaseProvider from '../components/supabase-provider'
import { createServerClient } from '../utils/supabase-server'

import Login from '../components/login'

import type { Database } from '../utils/database.types'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'

// 'npx supabase gen types typescript --local > ./src/utils/database.types.ts'
export type TypedSupabaseClient = SupabaseClient<Database>

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
	const supabase = createServerClient()

	const {
		data: { session },
	} = await supabase.auth.getSession()

	return (
		<html lang="en">
			<body className={`${josefin_sans.className} bg-gray-950 text-gray-200`}>
				<SupabaseProvider session={session}>
					<SupabaseListener serverAccessToken={session?.access_token} />
					{children}
					<div className="flex justify-center gap-2 py-12">
						<Login />
					</div>
				</SupabaseProvider>
			</body>
		</html>
	)
}
