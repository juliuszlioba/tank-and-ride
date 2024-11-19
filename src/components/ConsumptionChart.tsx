"use client";

import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChartSpline } from "lucide-react";

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

export function ConsumptionChart({
  chartData,
}: {
  chartData: { kilometrage: number; consumption: number }[];
}) {
  const [chartFull, setChartFull] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 724) {
      setChartFull(false);
    }
  }, []);

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
            tickFormatter={(value) => `${value}`}
            tickMargin={4}
            ticks={[4, 5, 6, 7, 8, 9]}
            tickLine={true}
            axisLine={false}
            domain={[3, 10]}
            width={20}
          />
          <CartesianGrid vertical={false} />
          <ChartTooltip
            labelFormatter={(value, payload) =>
              payload[0].payload?.kilometrage + " km"
            }
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
          className={`items-end ${chartFull && "text-primary"}`}
          variant={"ghost"}
          onClick={() => setChartFull(true)}
        >
          <ChartSpline strokeWidth={1.5} className="mb-1" /> Full
        </Button>
        <Button
          className={`items-end ${!chartFull && "text-primary"}`}
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
