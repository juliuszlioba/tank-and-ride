import AddForm from '@/components/addRecord'
import Chart from '@/components/chart'
import RemoveRecord from '@/components/removeRecord'
import processData from '@/utils/records-mutation'
import { createServerClient } from '@/utils/supabase-server'

export default async function Home() {
	const supabase = createServerClient()
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
						<p className="to-red-600 bg-gradient-to-r from-yellow-500 bg-clip-text p-4 text-center text-4xl text-transparent">
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

				{session && <AddForm />}

				<div className="mx-auto">
					<table>
						<thead>
							<tr>
								<th className="xs:text-base pr-2 text-left text-xs font-semibold text-gray-200 md:pr-4">
									Kilometrage
								</th>
								<th className="xs:text-base px-2 text-left text-xs font-semibold text-gray-200 md:px-4">
									Difrence
								</th>
								<th className="xs:text-base px-2 text-left text-xs font-semibold text-gray-200 md:px-4">
									Fuel
								</th>
								<th
									className="xs:text-base pl-2 text-left text-xs font-semibold text-gray-200 md:pl-4"
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
										<td className="xs:text-xl py-1 pr-2 text-base text-white md:pr-4 lg:text-2xl">
											{item.kilometrage}{' '}
											<span className="xs:text-lg text-xs text-gray-600">
												km
											</span>
										</td>
										<td className="px-2 py-1 text-base text-white sm:text-xl md:px-4 lg:text-2xl">
											{item.difrence || '-'}{' '}
											<span className="xs:text-lg text-xs text-gray-600">
												km
											</span>
										</td>
										<td className="px-2 py-1 text-base text-white sm:text-xl md:px-4 lg:text-2xl">
											{item.tank_add}{' '}
											<span className="xs:text-lg text-xs text-gray-600">
												l
											</span>
										</td>
										<td className="px-2 py-1 text-base text-white sm:text-xl md:px-4 lg:text-2xl">
											{item.consumption ? item.consumption.toFixed(2) : '-'}{' '}
											<span className="xs:text-lg text-xs text-gray-600">
												l/100km
											</span>
										</td>
										{session && (
											<td className="flex items-center gap-2 py-1 pl-2 md:pl-4">
												<RemoveRecord id={item.id} />
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
