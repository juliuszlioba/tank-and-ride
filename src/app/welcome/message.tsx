'use client'

import { useSearchParams } from 'next/navigation'

export default function WelcomeMessage() {
	const searchParams = useSearchParams()

	const error = searchParams.get('error')
	const error_description = searchParams.get('error_description')

	if (error) {
		return (
			<>
				<p className="pb-1 text-2xl">Oh no...</p>
				<p>{error_description}</p>
			</>
		)
	}

	return (
		<>
			<p className="pb-1 text-2xl">I&#39;m in!</p>
			<p>Time for action!</p>
		</>
	)
}
