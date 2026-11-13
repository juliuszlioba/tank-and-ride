"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { updateRecord } from "@/app/actions";
import type { RecordFormInput } from "@/lib/record-schema";
import type { Tables } from "@/utils/supabase/database.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RecordForm from "./RecordForm";

export default function EditRecord({ record }: { record: Tables<"records"> }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Edit record at ${record.kilometrage} km`}
          className="size-8 text-muted-foreground"
        >
          <Pencil strokeWidth={1.25} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit record</DialogTitle>
          <DialogDescription>
            Saved on {record.created_at.slice(0, 10)}
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so it always starts from the current values. */}
        {open && (
          <RecordForm
            variant="stacked"
            defaultValues={{
              kilometrage: record.kilometrage.toString(),
              fuel: record.tank_add.toString(),
              tank_mark:
                record.tank_mark.toString() as RecordFormInput["tank_mark"],
              environment: record.environment ?? "mix",
            }}
            action={(values) => updateRecord(record.id, values)}
            onSuccess={() => setOpen(false)}
            renderSubmit={(pending) => (
              <Button
                type="submit"
                disabled={pending}
                className="w-full pb-1.5 pt-2"
              >
                {pending ? "Saving…" : "Save changes"}
              </Button>
            )}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
