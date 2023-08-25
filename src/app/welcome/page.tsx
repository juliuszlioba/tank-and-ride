import WelcomeMessage from './message'
import { ContinueButton } from './button'

export const dynamic = 'force-dynamic'

export default function Page() {
	return (
		<main className="flex w-full flex-col justify-center gap-4 pt-8">
			<div className="flex flex-col justify-center">
				<div className="grid justify-center text-center">
					<WelcomeMessage />
				</div>
				<div className="grid justify-center pt-2">
					<ContinueButton />
				</div>
			</div>
		</main>
	)
}
