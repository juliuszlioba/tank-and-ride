'use client'

import { useSupabase } from './supabase-provider'

// Supabase auth needs to be triggered client-side
export default function Login() {
	const { supabase, session } = useSupabase()

	// const handleEmailLogin = async () => {
	//   const { error } = await supabase.auth.signInWithPassword({
	//     email: 'some@email.com',
	//     password: '1234'
	//   });

	//   if (error) {
	//     console.log({ error });
	//   }
	// };

	const handleGitHubLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
		})

		if (error) {
			console.log({ error })
		}
	}

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut()

		if (error) {
			console.log({ error })
		}
	}

	// this `session` is from the root loader - server-side
	// therefore, it can safely be used to conditionally render
	// SSR pages without issues with hydration
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
			{/* <button onClick={handleEmailLogin} className="text-gray-200">Email Login</button> */}
			<button onClick={handleGitHubLogin} className="text-gray-200 flex gap-2 items-center">
				Login <svg
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
