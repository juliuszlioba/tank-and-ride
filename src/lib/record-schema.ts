import { z } from "zod";

// Shared between the client form (instant feedback) and the server actions
// (the actual gatekeeper). Form values are strings; the schema turns them into
// numbers and accepts both "11.5" and "11,5" as decimal input.
const numeric = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .transform((value) => Number(value.replace(",", ".")));

export const environments = ["city", "nature", "mix"] as const;
export const tankMarks = ["0", "1", "2", "3", "4", "5", "6"] as const;

export const recordFormSchema = z.object({
  kilometrage: numeric("Km").pipe(
    z
      .number({ invalid_type_error: "Km must be a number" })
      .int("Km must be a whole number")
      .min(0, "Km can't be negative")
      .max(9_999_999, "Km is too large"),
  ),
  fuel: numeric("Fuel").pipe(
    z
      .number({ invalid_type_error: "Fuel must be a number" })
      .min(0, "Fuel can't be negative")
      .max(100, "Fuel is too large"),
  ),
  tank_mark: z.enum(tankMarks).transform(Number),
  environment: z.enum(environments),
});

export type RecordFormInput = z.input<typeof recordFormSchema>;
export type RecordFormOutput = z.output<typeof recordFormSchema>;
