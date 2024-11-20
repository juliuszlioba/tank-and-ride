import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { count } = await supabase
    .from("records")
    .select("*", { count: "exact" });

  console.log(`cron: records count: ${count}`);

  return NextResponse.json({ ok: true });
}
