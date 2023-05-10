"use client";

import { useState, useRef } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function Chart({ data }: { data: any }) {
  const [chartMode, setChartMode] = useState(true);
  const chartRef = useRef();

  const chartData = {
    labels: chartMode
      ? data.kilometragesDataArray
      : data.kilometragesDataArray?.slice(-15),
    datasets: [
      {
        id: 1,
        label: "Consumption",
        data: chartMode
          ? data.consumtionDataArray
          : data.consumtionDataArray?.slice(-15),
        tension: 0.5,
        borderColor: "#e04f1e",
        pointBackgroundColor: "#e04f1e",
      },
    ],
  };

  return (
    <div className="relative flex w-full flex-col gap-2">
      <div className="chart-container relative mx-auto h-[200px] w-[90vw]">
        <Line
          ref={chartRef}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            plugins: {
              tooltip: {
                displayColors: false,
                borderColor: "#e04f1e",
                borderWidth: 2,
                bodyFont: { family: "var(--font-josefin_sans)" },
              },
            },
            scales: {
              x: {
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                ticks: {
                  font: { family: "var(--font-josefin_sans)" },
                },
                grid: {
                  color: "#e5a80f1A",
                },
              },
            },
          }}
          data={chartData}
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => setChartMode(!chartMode)}
          className="text-white hover:text-yellow-500"
        >
          {chartMode ? "Full data" : "Recent data"}
        </button>
      </div>
    </div>
  );
}
