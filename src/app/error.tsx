"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 p-8">
      <p>Sorry, something went wrong</p>
      <Button className="pb-1.5 pt-2" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
