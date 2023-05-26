'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import type { Session } from '@supabase/auth-helpers-nextjs'

export default function LoginButtons({ session }: { session: Session | null }) {
	const router = useRouter()
	const supabase = createClientComponentClient()

	const handleGitHubLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL as string}/welcome`,
			},
		})
		router.refresh()

		if (error) {
			console.log({ error })
		}
	}

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut()
		router.refresh()

		if (error) {
			console.log({ error })
		}
	}

	return session ? (
		<>
			<div className="flex flex-col justify-center gap-4">
				<div className="flex items-center gap-2 text-gray-100">
					{session.user?.user_metadata && (
						<img
							src={session.user?.user_metadata.avatar_url}
							alt="avatar"
							className="h-6 w-6 rounded-full"
						/>
					)}
					{session.user?.user_metadata.name}
				</div>
				<button onClick={handleLogout} className="text-gray-200">
					Logout
				</button>
			</div>
		</>
	) : (
		<>
			<button
				onClick={handleGitHubLogin}
				className="flex items-center gap-2 text-gray-200"
			>
				Login{' '}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
				</svg>
			</button>
		</>
	)
}
