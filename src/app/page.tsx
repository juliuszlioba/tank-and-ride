import { Building2, Shrub } from "lucide-react";

import { getRecordsSummary } from "@/lib/records";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/utils/supabase/database.types";
import { ConsumptionChart } from "@/components/ConsumptionChart";
import AddRecord from "@/components/AddRecord";
import EditRecord from "@/components/EditRecord";
import DeleteRecord from "@/components/DeleteRecord";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function EnvironmentIcon({
  environment,
}: {
  environment: Tables<"records">["environment"];
}) {
  switch (environment) {
    case "city":
      return (
        <Building2 className="size-5" strokeWidth={1.5} aria-label="City" />
      );
    case "nature":
      return <Shrub className="size-5" strokeWidth={1.5} aria-label="Nature" />;
    case "mix":
      return (
        <svg
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth={1.5}
          fill="none"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Mix"
        >
          <path d="M8.3 22v-5.8l-1.7-1.7" />
          <path d="M11.8 19.2H7.9C4.4 19 2.4 17.7 2.3 14s.9-3.9 2.6-4.9c.2-3.7 1.3-5.9 6.9-5.6M11.8 2h4c1.1 0 2 .9 2 2v18h-6V2ZM17.8 9h2c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2h-2M11.8 6h2M11.8 10h2M11.8 14h2M11.8 18h2" />
        </svg>
      );
    default:
      return null;
  }
}

function Value({ value, unit }: { value: React.ReactNode; unit: string }) {
  return (
    <div className="flex pt-1 leading-none">
      {value}
      <span className="pl-1.5 text-sm text-muted-foreground">{unit}</span>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    { records, latest, chartData, totalKilometrage, averageConsumption },
  ] = await Promise.all([supabase.auth.getUser(), getRecordsSummary()]);

  return (
    <main className="space-y-4 pt-8">
      <div className="flex w-full items-end justify-center gap-2 bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
        <div className="text-4xl font-semibold">{totalKilometrage}</div>
        <div className="pb-0.5 text-2xl"> km /</div>
        <div className="text-4xl font-semibold">
          {averageConsumption === null ? "–" : averageConsumption.toFixed(2)}
        </div>
        <div className="pb-0.5 text-2xl"> l/100km</div>
      </div>

      {chartData.length > 0 && <ConsumptionChart chartData={chartData} />}

      {user && (
        <div className="flex w-full items-center justify-center">
          <AddRecord
            latest={
              latest && {
                kilometrage: latest.kilometrage,
                environment: latest.environment,
              }
            }
          />
        </div>
      )}

      <div className="flex w-full justify-center">
        {records.length === 0 ? (
          <p className="p-8 text-muted-foreground">No records yet.</p>
        ) : (
          <Table className="mx-auto max-w-md">
            <TableHeader>
              <TableRow>
                <TableHead>Kilometrage</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Fuel</TableHead>
                <TableHead>
                  <span className="sr-only">Environment</span>
                </TableHead>
                <TableHead>Consumption</TableHead>
                {user && (
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Value value={item.kilometrage} unit="km" />
                  </TableCell>
                  <TableCell>
                    <Value value={item.difference ?? "–"} unit="km" />
                  </TableCell>
                  <TableCell>
                    <Value value={item.tank_add} unit="l" />
                  </TableCell>
                  <TableCell className="text-primary">
                    <EnvironmentIcon environment={item.environment} />
                  </TableCell>
                  <TableCell>
                    <Value
                      value={
                        item.consumption === null
                          ? "–"
                          : item.consumption.toFixed(2)
                      }
                      unit="l/100km"
                    />
                  </TableCell>
                  {user && (
                    <TableCell>
                      <div className="flex gap-1">
                        <EditRecord
                          record={{
                            id: item.id,
                            created_at: item.created_at,
                            kilometrage: item.kilometrage,
                            tank_add: item.tank_add,
                            tank_mark: item.tank_mark,
                            environment: item.environment,
                          }}
                        />
                        <DeleteRecord
                          id={item.id}
                          kilometrage={item.kilometrage}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
