"use client";

import { CirclePlus, LoaderCircle } from "lucide-react";

import { addRecord } from "@/app/actions";
import type { RecordFormInput } from "@/lib/record-schema";
import type { Tables } from "@/utils/supabase/database.types";
import { Button } from "@/components/ui/button";
import RecordForm from "./RecordForm";

type LatestRecord = Pick<Tables<"records">, "kilometrage" | "environment">;

function emptyValues(
  kilometrage: string,
  environment: RecordFormInput["environment"],
): RecordFormInput {
  return { kilometrage, fuel: "", tank_mark: "0", environment };
}

export default function AddRecord({ latest }: { latest: LatestRecord | null }) {
  return (
    <div className="rounded-xl border-2 border-primary p-2">
      <RecordForm
        variant="inline"
        defaultValues={emptyValues(
          latest?.kilometrage.toString() ?? "",
          latest?.environment ?? "mix",
        )}
        action={addRecord}
        // Prefill the next entry with the km and environment just saved.
        onSuccess={(values) =>
          emptyValues(values.kilometrage, values.environment)
        }
        renderSubmit={(pending) => (
          <Button
            variant="default"
            size="icon"
            type="submit"
            disabled={pending}
            aria-label="Add record"
            className="shrink-0 [&_svg]:size-6"
          >
            {pending ? (
              <LoaderCircle className="animate-spin" strokeWidth={1.5} />
            ) : (
              <CirclePlus strokeWidth={1.5} />
            )}
          </Button>
        )}
      />
    </div>
  );
}
