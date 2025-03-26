"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useEffect, useState } from "react";
import axios from "axios";

const chartConfig = {
  all: {
    label: "All",
    color: "#2563eb",
  },
  success: {
    label: "Success",
    color: "#60a5fa",
  },
  fail: {
    label: "Fail",
    color: "#2563eb",
  },
  delay: {
    label: "Delay",
    color: "#60a5fa",
  },
};

export function ChartOfPerfomence() {
  const [metricsData, setMetricsData] = useState({});

  // call get metrics api end point
  const fetchMetrics = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/metrics`
      );
      console.log("Metrics:", response.data);
      setMetricsData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const chartData = [
    {
      carrier: "FedEx",
      all: metricsData.feedEx_count,
      success: metricsData.fedExDelivered_count,
      fail: metricsData.fedExFailed_count,
      delay: metricsData.fedExDelay_count,
    },
    {
      carrier: "DHL",
      all: metricsData.dhl_count,
      success: metricsData.dhlDelivered_count,
      fail: metricsData.dhlFailed_count,
      delay: metricsData.dhlDelay_count,
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="carrier"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="all" fill="var(--color-all)" radius={4} />
        <Bar dataKey="success" fill="var(--color-success)" radius={4} />
        <Bar dataKey="fail" fill="var(--color-fail)" radius={4} />
        <Bar dataKey="delay" fill="var(--color-delay)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
