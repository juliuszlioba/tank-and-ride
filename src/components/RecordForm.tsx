"use client";

import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { ActionResult } from "@/app/actions";
import {
  environments,
  recordFormSchema,
  tankMarks,
  type RecordFormInput,
} from "@/lib/record-schema";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const environmentLabels: Record<(typeof environments)[number], string> = {
  city: "City",
  nature: "Nature",
  mix: "Mix",
};

type RecordFormProps = {
  defaultValues: RecordFormInput;
  action: (values: RecordFormInput) => Promise<ActionResult>;
  /** Called after a successful save; may return new values to reset the form to. */
  onSuccess?: (values: RecordFormInput) => RecordFormInput | void;
  /** "inline" = compact bar without labels, "stacked" = labelled fields for dialogs. */
  variant: "inline" | "stacked";
  renderSubmit: (pending: boolean) => ReactNode;
};

export default function RecordForm({
  defaultValues,
  action,
  onSuccess,
  variant,
  renderSubmit,
}: RecordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<RecordFormInput>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
  });
  const pending = form.formState.isSubmitting;
  const stacked = variant === "stacked";

  async function onSubmit() {
    setServerError(null);
    const values = form.getValues();
    try {
      const result = await action(values);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      const next = onSuccess?.(values);
      if (next) form.reset(next);
    } catch (error) {
      console.error(error);
      setServerError("Something went wrong, please try again");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(stacked ? "space-y-4" : "space-y-2")}
      >
        <div
          className={cn(
            "flex gap-2",
            stacked ? "flex-col" : "flex-wrap items-start justify-center",
          )}
        >
          <FormField
            control={form.control}
            name="kilometrage"
            render={({ field }) => (
              <FormItem>
                {stacked && <FormLabel>Kilometrage (km)</FormLabel>}
                <FormControl>
                  <Input
                    placeholder="Km"
                    aria-label="Kilometrage"
                    inputMode="numeric"
                    autoComplete="off"
                    {...field}
                    className={cn(!stacked && "w-[80px]")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuel"
            render={({ field }) => (
              <FormItem>
                {stacked && <FormLabel>Fuel (l)</FormLabel>}
                <FormControl>
                  <Input
                    placeholder="Fuel"
                    aria-label="Fuel"
                    inputMode="decimal"
                    autoComplete="off"
                    {...field}
                    className={cn(!stacked && "w-[80px]")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tank_mark"
            render={({ field }) => (
              <FormItem>
                {stacked && <FormLabel>Tank mark</FormLabel>}
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      aria-label="Tank mark"
                      className={cn(!stacked && "w-[60px]")}
                    >
                      <SelectValue placeholder="Tank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tankMarks.map((mark) => (
                      <SelectItem key={mark} value={mark}>
                        {mark}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem>
                {stacked && <FormLabel>Environment</FormLabel>}
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      aria-label="Environment"
                      className={cn(!stacked && "w-[100px]")}
                    >
                      <SelectValue placeholder="Environment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {environments.map((env) => (
                      <SelectItem key={env} value={env}>
                        {environmentLabels[env]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!stacked && renderSubmit(pending)}
        </div>

        {serverError && (
          <p role="alert" className="text-center text-sm text-destructive">
            {serverError}
          </p>
        )}

        {stacked && renderSubmit(pending)}
      </form>
    </Form>
  );
}
