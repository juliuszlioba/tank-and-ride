"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import addRecordAction from "./addRecordAction";

import { useRouter } from "next/navigation";

export const addRecordFormSchema = z.object({
  kilometrage: z.string(),
  fuel: z.string(),
  tank_mark: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
  environment: z.enum(["city", "nature", "mix"]),
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

import { CirclePlus } from "lucide-react";

export default function AddRecord({ lastRecord }: { lastRecord: number }) {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof addRecordFormSchema>>({
    resolver: zodResolver(addRecordFormSchema),
    defaultValues: {
      kilometrage: lastRecord.toString(),
      fuel: "",
      tank_mark: "0",
      environment: "mix",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addRecordFormSchema>) {
    const { data, error } = await addRecordAction(values);

    if (error) {
      console.log(error);
    }

    if (data?.status === "success") {
      form.reset({
        kilometrage: lastRecord.toString(),
        fuel: "",
        tank_mark: "0",
        environment: "mix",
      });
    }

    router.refresh();
  }

  return (
    <div className="rounded-xl border-2 border-primary p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="kilometrage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Km"
                      type="number"
                      {...field}
                      className="max-w-[80px]"
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
                  <FormControl>
                    <Input
                      placeholder="Fuel"
                      type="number"
                      {...field}
                      className="max-w-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="tank_mark"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[60px]">
                      <SelectValue placeholder="Tank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Enviroment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="mix">Mix</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={"default"}
              size={"icon"}
              type="submit"
              className="[&_svg]:size-6"
            >
              <CirclePlus
                className="inline-block h-12 w-12"
                strokeWidth={1.5}
              />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
