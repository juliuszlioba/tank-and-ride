
export default function processData(
	data: {
		created_at: string
		id: number
		kilometrage: number
		tank_add: number
		tank_mark: number
	}[]
) {
	let transformedData = []
	let totalKilometrage = 0
	let avarageConsumption = 0
	let kilometragesDataArray = []
	let consumtionDataArray = []

	// Transform data
	if (data.length > 1) {
		let previousItem = data[0]

		// First item in array
		transformedData.push({
			...previousItem,
			difrence: null,
			consumption: null,
		})

		// Fill missing data
		for (let i = 1; i < data.length; i++) {
			const currentItem = data[i]

			const transformedItem = {
				...currentItem,
				difrence: currentItem.kilometrage - previousItem.kilometrage,
				consumption:
					(currentItem.tank_add * 100) /
					(currentItem.kilometrage - previousItem.kilometrage),
			}

			avarageConsumption = avarageConsumption + transformedItem.consumption
			transformedData.push(transformedItem)

			kilometragesDataArray.push(`${transformedItem.kilometrage} km`)
			consumtionDataArray.push(transformedItem.consumption.toFixed(2))

			previousItem = currentItem
		}

		totalKilometrage = data[data.length - 1].kilometrage - data[0].kilometrage
	}

	return {
		records: transformedData.reverse(),
		totalKilometrage,
		avarageConsumption: avarageConsumption / (data.length - 1),
		kilometragesDataArray,
		consumtionDataArray,
	}
}
