import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Keep-alive ping (see vercel.json) so the free Supabase project isn't paused
// for inactivity. When CRON_SECRET is set, Vercel sends it as a Bearer token and
// any other caller is rejected.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("records")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("cron: query failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  console.log(`cron: records count: ${count}`);
  return NextResponse.json({ ok: true });
}
