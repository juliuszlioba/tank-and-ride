import { createClient } from "@/utils/supabase/server";

export default async function processRecords() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("records")
    .select("*")
    .order("kilometrage");

  const transformedData = [];
  let totalKilometrage = 0;
  let avarageConsumption = 0;
  const chartArray = [];

  if (!data) {
    return {
      records: [],
      totalKilometrage,
      avarageConsumption: 0,
      chartArray: [],
    };
  }

  if (data.length > 1) {
    let previousItem = data[0];

    // First item in array
    transformedData.push({
      ...previousItem,
      difrence: null,
      consumption: null,
    });

    // Fill missing data
    for (let i = 1; i < data.length; i++) {
      const currentItem = data[i];

      const transformedItem = {
        ...currentItem,
        difrence: currentItem.kilometrage - previousItem.kilometrage,
        consumption:
          (currentItem.tank_add * 100) /
          (currentItem.kilometrage - previousItem.kilometrage),
      };

      avarageConsumption = avarageConsumption + transformedItem.consumption;
      transformedData.push(transformedItem);

      chartArray.push({
        kilometrage: transformedItem.kilometrage,
        consumption: transformedItem.consumption,
      });

      previousItem = currentItem;
    }

    totalKilometrage = data[data.length - 1].kilometrage - data[0].kilometrage;
  }

  return {
    records: transformedData.reverse(),
    totalKilometrage,
    avarageConsumption: avarageConsumption / (data.length - 1),
    chartArray,
  };
}
