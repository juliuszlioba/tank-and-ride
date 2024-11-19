import processRecords from "@/utils/records-mutation";
import { ConsumptionChart } from "@/components/ConsumptionChart";
import { Building2, Shrub, Trash2 } from "lucide-react";
import AddRecord from "@/components/AddRecord";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    records: data,
    chartArray,
    totalKilometrage,
    avarageConsumption,
  } = await processRecords();

  async function deleteRecord(formData: FormData) {
    "use server";

    const data = {
      id: formData.get("id") as string,
    };
    const supabase = await createClient();

    // User check
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      redirect("/error");
    }

    // Remove record
    const { error: resError } = await supabase
      .from("records")
      .delete()
      .eq("id", data.id);

    if (resError) {
      redirect("/error");
    }

    // Clear cache and redirect
    revalidatePath("/");
    redirect(`/`);
  }

  return (
    <main className="space-y-4 pt-8">
      <div className="flex w-full items-end justify-center gap-2 bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
        <div className="text-4xl font-semibold">{totalKilometrage}</div>
        <div className="pb-0.5 text-2xl"> km /</div>
        <div className="text-4xl font-semibold">
          {avarageConsumption.toFixed(2)}
        </div>
        <div className="pb-0.5 text-2xl"> l/100km</div>
      </div>

      <div>{chartArray && <ConsumptionChart chartData={chartArray} />}</div>

      {user && (
        <div className="flex w-full items-center justify-center">
          <AddRecord lastRecord={data[0].kilometrage} />
        </div>
      )}

      <div className="flex min-h-screen w-full items-center justify-center">
        <Table className="mx-auto max-w-md">
          <TableHeader>
            <TableRow>
              <TableHead>Kilometrage</TableHead>
              <TableHead>Diference</TableHead>
              <TableHead>Fuel</TableHead>
              <TableHead></TableHead>
              <TableHead>Consumption</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex pt-1 leading-none">
                      {item.kilometrage}
                      <span className="pl-1.5 text-sm text-muted-foreground">
                        km
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex pt-1 leading-none">
                      {item.difrence || 0}
                      <span className="pl-1.5 text-sm text-muted-foreground">
                        km
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex pt-1 leading-none">
                      {item.tank_add}
                      <span className="pl-1.5 text-sm text-muted-foreground">
                        l
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-primary">
                    {item.environment === "city" && (
                      <Building2 className="size-5" strokeWidth={1.5} />
                    )}
                    {item.environment === "nature" && (
                      <Shrub className="size-5" strokeWidth={1.5} />
                    )}
                    {item.environment === "mix" && (
                      <svg
                        className="size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.3 22v-5.8l-1.7-1.7" />
                        <path d="M11.8 19.2H7.9C4.4 19 2.4 17.7 2.3 14s.9-3.9 2.6-4.9c.2-3.7 1.3-5.9 6.9-5.6M11.8 2h4c1.1 0 2 .9 2 2v18h-6V2ZM17.8 9h2c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2h-2M11.8 6h2M11.8 10h2M11.8 14h2M11.8 18h2" />
                      </svg>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex pt-1 leading-none">
                      {item.consumption ? item.consumption.toFixed(2) : 0}
                      <span className="pl-1.5 text-sm text-muted-foreground">
                        l/100km
                      </span>
                    </div>
                  </TableCell>
                  {user && (
                    <TableCell className="text-muted-foreground">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Trash2
                            className="cursor-pointer rounded hover:bg-muted"
                            strokeWidth={1.25}
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                          </DialogHeader>
                          <div className="flex gap-2">
                            <form action="">
                              <input type="hidden" name="id" value={item.id} />
                              <Button
                                variant={"destructive"}
                                className="inline-flex items-center pb-1.5 pt-2"
                                type="submit"
                                formAction={deleteRecord}
                              >
                                <Trash2 className="mb-1" /> Delete
                              </Button>
                            </form>
                            <DialogClose asChild autoFocus>
                              <Button
                                variant={"secondary"}
                                className="inline-flex w-full items-center pb-1.5 pt-2"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
