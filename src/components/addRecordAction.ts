"use server";

import { z } from "zod";
import { addRecordFormSchema } from "./AddRecord";
import { revalidatePath } from "next/cache";
import { console } from "inspector";
import { toFloat, toInt } from "radash";
import { createClient } from "@/utils/supabase/server";

export default async function addRecordAction(
  data: z.infer<typeof addRecordFormSchema>,
) {
  const supabase = await createClient();

  console.log(data);

  const dataLoad = {
    kilometrage: toInt(data.kilometrage) || 0,
    tank_add: toFloat(data.fuel) || 0,
    tank_mark: toInt(data.tank_mark) || 0,
    environment: data.environment || undefined,
  };

  const { error: resError } = await supabase.from("records").insert(dataLoad);

  if (resError) {
    return { data: null, error: resError };
  }

  revalidatePath("/");

  return { data: { status: "success" }, error: null };
}
