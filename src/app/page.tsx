import AddForm from '@/components/addRecord'
import Chart from '@/components/chart'
import RemoveRecord from '@/components/removeRecord'
import processData from '@/utils/records-mutation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export default async function Home() {
	const supabase = createServerComponentClient<Database>({
		cookies,
	})
	const { data } = await supabase.from('records').select('*')
	const {
		data: { session },
	} = await supabase.auth.getSession()

	const Table = () => {
		if (!data) {
			return <div>Problem loading data</div>
		}
		const processedData = processData(data)
		return (
			<>
				<div className="grid">
					<div className="mt-8">
						<p className="bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text p-4 text-center text-4xl text-transparent">
							<span className="font-semibold">
								{processedData.totalKilometrage}
							</span>{' '}
							<span className="text-2xl">km</span>
							{' / '}
							<span className="font-semibold">
								{processedData.avarageConsumption.toFixed(2)}
							</span>{' '}
							<span className="text-2xl">l/100km</span>
						</p>
					</div>
				</div>

				<Chart data={processedData} />

				{session && <AddForm session={session} />}

				<div className="mx-auto">
					<table>
						<thead>
							<tr>
								<th className="pr-2 text-left text-xs font-semibold text-gray-200 xs:text-base md:pr-4">
									Kilometrage
								</th>
								<th className="px-2 text-left text-xs font-semibold text-gray-200 xs:text-base md:px-4">
									Difrence
								</th>
								<th className="px-2 text-left text-xs font-semibold text-gray-200 xs:text-base md:px-4">
									Fuel
								</th>
								<th
									className="pl-2 text-left text-xs font-semibold text-gray-200 xs:text-base md:pl-4"
									colSpan={session ? 2 : 1}
								>
									Consumtion
								</th>
							</tr>
						</thead>
						<tbody>
							{processedData.records.map((item) => {
								return (
									<tr key={item.id}>
										<td className="py-1 pr-2 text-xl text-white md:pr-4 lg:text-2xl">
											{item.kilometrage}{' '}
											<span className="text-xs text-gray-600 xs:text-lg">
												km
											</span>
										</td>
										<td className="px-2 py-1 text-xl text-white md:px-4 lg:text-2xl">
											{item.difrence || '-'}{' '}
											<span className="text-xs text-gray-600 xs:text-lg">
												km
											</span>
										</td>
										<td className="px-2 py-1 text-xl text-white  md:px-4 lg:text-2xl">
											{item.tank_add}{' '}
											<span className="text-xs text-gray-600 xs:text-lg">
												l
											</span>
										</td>
										<td className="px-2 py-1 text-xl text-white md:px-4 lg:text-2xl">
											{item.consumption ? item.consumption.toFixed(2) : '-'}{' '}
											<span className="text-xs text-gray-600 xs:text-lg">
												l/100km
											</span>
										</td>
										{session && (
											<td className="flex items-center gap-2 py-1 pl-2 md:pl-4">
												<RemoveRecord session={session} id={item.id} />
											</td>
										)}
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</>
		)
	}

	return (
		<main className="flex flex-col justify-center gap-4">
			<Table />
		</main>
	)
}
