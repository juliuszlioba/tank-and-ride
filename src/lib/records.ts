import type { Tables } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";

type DbRecord = Tables<"records">;

export type RecordRow = DbRecord & {
  /** km driven since the previous fill-up (null for the very first record) */
  difference: number | null;
  /** l/100km for this fill-up (null when it can't be computed) */
  consumption: number | null;
};

export type ChartPoint = { kilometrage: number; consumption: number };

/**
 * Derives per-fill-up and overall stats. `rows` must be sorted by kilometrage
 * ascending. Each fill-up is assumed to top the tank up, so the fuel added
 * equals the fuel burned since the previous record.
 */
export function summarizeRecords(rows: DbRecord[]) {
  const withStats: RecordRow[] = rows.map((row, i) => {
    if (i === 0) return { ...row, difference: null, consumption: null };

    const difference = row.kilometrage - rows[i - 1].kilometrage;
    const consumption =
      difference > 0 ? (row.tank_add * 100) / difference : null;
    return { ...row, difference, consumption };
  });

  const first = rows[0];
  const latest = rows.at(-1) ?? null;
  const totalKilometrage =
    first && latest ? latest.kilometrage - first.kilometrage : 0;

  // The first record is only a baseline: its fuel was burned before tracking
  // started, so it is excluded from the total.
  const totalFuel = rows.slice(1).reduce((sum, row) => sum + row.tank_add, 0);
  const averageConsumption =
    totalKilometrage > 0 ? (totalFuel * 100) / totalKilometrage : null;

  const chartData: ChartPoint[] = withStats.flatMap((row) =>
    row.consumption === null
      ? []
      : [{ kilometrage: row.kilometrage, consumption: row.consumption }],
  );

  return {
    records: withStats.reverse(), // newest first for the table
    latest,
    totalKilometrage,
    averageConsumption,
    chartData,
  };
}

export async function getRecordsSummary() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("records")
    .select("*")
    .order("kilometrage", { ascending: true });

  if (error) throw new Error(`Failed to load records: ${error.message}`);

  return summarizeRecords(data);
}
