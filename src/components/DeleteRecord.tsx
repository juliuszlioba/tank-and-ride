"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteRecord } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteRecord({
  id,
  kilometrage,
}: {
  id: number;
  kilometrage: number;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setError(null);
  }

  function onDelete() {
    startTransition(async () => {
      try {
        const result = await deleteRecord(id);
        if (result.ok) setOpen(false);
        else setError(result.error);
      } catch (e) {
        console.error(e);
        setError("Something went wrong, please try again");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete record at ${kilometrage} km`}
          className="size-8 text-muted-foreground"
        >
          <Trash2 strokeWidth={1.25} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This permanently deletes the record at {kilometrage} km.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="inline-flex items-center pb-1.5 pt-2"
            disabled={pending}
            onClick={onDelete}
          >
            <Trash2 className="mb-1" /> {pending ? "Deleting…" : "Delete"}
          </Button>
          <DialogClose asChild autoFocus>
            <Button
              variant="secondary"
              className="inline-flex w-full items-center pb-1.5 pt-2"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
