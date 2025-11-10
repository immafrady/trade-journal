"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TabChart() {
  return (
    <div className={"flex flex-col gap-2"}>
      <Card>
        <CardHeader>
          <CardTitle>历史收益变化</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] max-h-[400px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
              height={500}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex w-full items-center gap-2 text-sm">
            <Button size={"sm"}>
              <SkipBack />
            </Button>
            <Button size={"sm"}>
              <StepBack />
            </Button>
            <Slider className={"flex-1"} />
            <Button size={"sm"}>
              <StepForward />
            </Button>
            <Button size={"sm"}>
              <SkipForward />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
