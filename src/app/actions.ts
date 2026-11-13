"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { recordFormSchema, type RecordFormOutput } from "@/lib/record-schema";

export type ActionResult = { ok: true } | { ok: false; error: string };

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const idSchema = z.number().int().positive();

const NOT_LOGGED_IN: ActionResult = {
  ok: false,
  error: "You are not logged in",
};
const NO_ROWS: ActionResult = {
  ok: false,
  error: "Record not found or you don't have permission to change it",
};

async function getAuthenticatedClient(): Promise<SupabaseClient | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function toRow(values: RecordFormOutput) {
  return {
    kilometrage: values.kilometrage,
    tank_add: values.fuel,
    tank_mark: values.tank_mark,
    environment: values.environment,
  };
}

function dbError(context: string, error: { message: string }): ActionResult {
  console.error(`${context}:`, error);
  return { ok: false, error: `${context}: ${error.message}` };
}

// Records are ordered by kilometrage and consumption is derived from the gap
// between neighbours, so two records with the same km would divide by zero.
async function checkKilometrageFree(
  supabase: SupabaseClient,
  kilometrage: number,
  excludeId?: number,
): Promise<ActionResult> {
  let query = supabase
    .from("records")
    .select("id", { count: "exact", head: true })
    .eq("kilometrage", kilometrage);
  if (excludeId !== undefined) query = query.neq("id", excludeId);

  const { count, error } = await query;
  if (error) return dbError("Could not check kilometrage", error);
  if (count) {
    return { ok: false, error: `A record at ${kilometrage} km already exists` };
  }
  return { ok: true };
}

export async function addRecord(input: unknown): Promise<ActionResult> {
  const parsed = recordFormSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await getAuthenticatedClient();
  if (!supabase) return NOT_LOGGED_IN;

  const free = await checkKilometrageFree(supabase, parsed.data.kilometrage);
  if (!free.ok) return free;

  const { data, error } = await supabase
    .from("records")
    .insert(toRow(parsed.data))
    .select("id");
  if (error) return dbError("Could not add record", error);
  if (!data?.length) return NO_ROWS;

  revalidatePath("/");
  return { ok: true };
}

export async function updateRecord(
  id: number,
  input: unknown,
): Promise<ActionResult> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid record id" };
  const parsed = recordFormSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await getAuthenticatedClient();
  if (!supabase) return NOT_LOGGED_IN;

  const free = await checkKilometrageFree(
    supabase,
    parsed.data.kilometrage,
    parsedId.data,
  );
  if (!free.ok) return free;

  // RLS silently filters rows the user may not touch, so ask for the updated
  // rows back to tell "nothing happened" apart from success.
  const { data, error } = await supabase
    .from("records")
    .update(toRow(parsed.data))
    .eq("id", parsedId.data)
    .select("id");
  if (error) return dbError("Could not update record", error);
  if (!data?.length) return NO_ROWS;

  revalidatePath("/");
  return { ok: true };
}

export async function deleteRecord(id: number): Promise<ActionResult> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid record id" };

  const supabase = await getAuthenticatedClient();
  if (!supabase) return NOT_LOGGED_IN;

  const { data, error } = await supabase
    .from("records")
    .delete()
    .eq("id", parsedId.data)
    .select("id");
  if (error) return dbError("Could not delete record", error);
  if (!data?.length) return NO_ROWS;

  revalidatePath("/");
  return { ok: true };
}
