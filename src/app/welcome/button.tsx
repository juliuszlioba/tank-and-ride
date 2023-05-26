'use client'

import { useRouter } from 'next/navigation'

export function ContinueButton() {
	const router = useRouter()

	const handleNextStep = async () => {
		await router.refresh()
		return router.push('/')
	}

	return (
		<>
			<button
				onClick={() => handleNextStep()}
				className="flex whitespace-nowrap text-primary hover:text-yellow-500"
			>
				Continue
			</button>
		</>
	)
}
