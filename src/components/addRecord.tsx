'use client'

import { useState } from 'react'
import { toFloat, toInt } from 'radash'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import type { Session } from '@supabase/auth-helpers-nextjs'

export default function AddForm({ session }: { session: Session | null }) {
	const supabase = createClientComponentClient()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<boolean>(false)
	const [kilometrage, setKilometrage] = useState<string>('')
	const [tank_add, setTank_add] = useState<string>('')
	const [tank_mark, setTank_mark] = useState<string>('0')
	const router = useRouter()

	// ADD NEW ITEM
	const handleAddNewRecord = async () => {
		setLoading(true)
		const dataLoad = {
			kilometrage: toInt(kilometrage) || 0,
			tank_add: toFloat(tank_add) || 0,
			tank_mark: toInt(tank_mark) || 0,
		}

		if (dataLoad.kilometrage === 0 || dataLoad.tank_add === 0) {
			setError(true)
		}

		if (session) {
			const { error: resError } = await supabase.from('records').insert({
				kilometrage: toInt(kilometrage) || 0,
				tank_add: toFloat(tank_add) || 0,
				tank_mark: toInt(tank_mark) || 0,
			})

			if (!resError) {
				router.refresh()
				setKilometrage('')
				setTank_add('')
				setTank_mark('0')
				setLoading(false)
				setError(false)
			} else {
				console.log(resError)
			}
		}

	}

	if (loading) {
		return <div className="mb-8 p-4">Loading...</div>
	}

	return (
		<>
			{error && (
				<div className="text-center text-red-600">Wrong type entered!</div>
			)}
			<div
				className={`mx-2 flex max-w-2xl items-center gap-2 rounded-lg border-2 p-2 sm:mx-auto ${
					error ? 'border-red-600' : 'border-primary'
				}`}
			>
				<input
					type="number"
					onChange={(e) => setKilometrage(e.target.value)}
					value={kilometrage}
					placeholder="Kilometrage"
					className="w-full appearance-none rounded-md border-transparent bg-gray-800 px-4 pb-1 pt-2 text-gray-100 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-primary"
				></input>
				<input
					type="number"
					onChange={(e) => setTank_add(e.target.value)}
					value={tank_add}
					placeholder="Fuel added"
					className="w-full appearance-none rounded-md border-transparent bg-gray-800 px-4 pb-1 pt-2 text-gray-100 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-primary"
				></input>
				<select
					value={tank_mark}
					onChange={(e) => setTank_mark(e.target.value)}
					className="w-4/12 appearance-none rounded-md border-transparent bg-gray-800 px-4 pb-1 pt-2 text-gray-100 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-primary"
				>
					<option value="0">0</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
				</select>

				<button onClick={() => handleAddNewRecord()} className="w-auto">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-6 w-6 text-primary hover:text-yellow-500"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</button>
			</div>
		</>
	)
}
