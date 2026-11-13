"use client";

import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useSyncExternalStore } from "react";
import { Button } from "./ui/button";
import { ChartSpline } from "lucide-react";
import type { ChartPoint } from "@/lib/records";
import { cn } from "@/lib/utils";

const chartConfig = {
  kilometrage: {
    label: "Kilometrage",
    color: "hsl(var(--chart-1))",
  },
  consumption: {
    label: "Consumption",
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const NARROW_QUERY = "(max-width: 723px)";

function subscribeToNarrow(onChange: () => void) {
  const mql = window.matchMedia(NARROW_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function ConsumptionChart({ chartData }: { chartData: ChartPoint[] }) {
  // Default to "recent" on narrow screens until the user picks a view.
  const isNarrow = useSyncExternalStore(
    subscribeToNarrow,
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  );
  const [userChoice, setChartFull] = useState<boolean | null>(null);
  const chartFull = userChoice ?? !isNarrow;

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={chartFull ? chartData : chartData.slice(-15)}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <YAxis
            tickMargin={4}
            tickLine={true}
            axisLine={false}
            allowDecimals={false}
            // Fit the axis to the data instead of a fixed 3–10 range that
            // would clip unusually high or low fill-ups.
            domain={[
              (min: number) => Math.max(0, Math.floor(min) - 1),
              (max: number) => Math.ceil(max) + 1,
            ]}
            width={20}
          />
          <CartesianGrid vertical={false} />
          <ChartTooltip
            labelFormatter={(_, payload) => {
              const km = payload?.[0]?.payload?.kilometrage;
              return km === undefined ? "" : `${km} km`;
            }}
            cursor={true}
            content={<ChartTooltipContent hideIndicator label={false} />}
          />
          <Line
            animationDuration={750}
            animationEasing="ease-in-out"
            dataKey="consumption"
            type="natural"
            stroke="var(--color-kilometrage)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-consumption)",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>

      <div className="flex justify-center gap-2">
        <Button
          className={cn("items-end", chartFull && "text-primary")}
          variant={"ghost"}
          onClick={() => setChartFull(true)}
        >
          <ChartSpline strokeWidth={1.5} className="mb-1" /> Full
        </Button>
        <Button
          className={cn("items-end", !chartFull && "text-primary")}
          variant={"ghost"}
          onClick={() => setChartFull(false)}
        >
          <ChartSpline strokeWidth={1.5} className="mb-1" />
          Recent
        </Button>
      </div>
    </div>
  );
}
