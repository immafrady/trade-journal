"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

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
import { ChartController } from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart/chart-controller";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import {
  TradeRecordChart,
  useTradeRecordChart,
} from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart/use-trade-record-chart";
import { formatShares } from "@/lib/market-utils";

const chartConfig = {
  price: {
    label: "价格",
    color: "var(--chart-1)",
  },
  shares: {
    label: "持仓份额",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TabChart() {
  const { id, data } = React.useContext(HoldingInfoContext)!;
  const list = useTradeRecordChart(id);
  const [records, setRecords] = React.useState<TradeRecordChart[]>([]);
  const onRangeChange = React.useCallback((record: TradeRecordChart[]) => {
    setRecords(record);
  }, []);

  const [priceYDomain, setPriceYDomain] = React.useState([0, 100]);
  const [sharesYDomain, setSharesYDomain] = React.useState([0, 100]);

  React.useEffect(() => {
    const prices = records.map((d) => d.price);
    const shares = records.map((d) => d.shares);
    let min = Math.min(...prices);
    let max = Math.max(...prices);
    let padding = (max - min) * 0.1;
    setPriceYDomain([min - padding, max + padding]);
    min = Math.min(...shares);
    max = Math.max(...shares);
    padding = (max - min) * 0.1;
    setSharesYDomain([min - padding, max + padding]);
  }, [records]);

  return (
    <div className={"flex flex-col gap-2"}>
      <Card>
        <CardHeader>
          <CardTitle>历史收益变化</CardTitle>
          {records && records.length && (
            <CardDescription>
              {records[0].tradedAt} 至 {records[records.length - 1].tradedAt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] max-h-[400px] w-full"
          >
            <ComposedChart
              accessibilityLayer
              data={records}
              margin={{
                top: 10,
                bottom: 5,
              }}
              height={500}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tradedAt"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="text-muted-foreground flex min-w-[130px] items-center text-xs">
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {name === "shares"
                            ? formatShares(value as number)
                            : data?.quote?.formatter(value as number)}
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <YAxis yAxisId="left" domain={sharesYDomain} />
              <YAxis
                yAxisId="right"
                orientation="right"
                width={0}
                domain={priceYDomain}
              />
              <Bar
                yAxisId="left"
                dataKey="shares"
                fill="var(--color-shares)"
                radius={2}
              />
              <Line
                yAxisId="right"
                dataKey="price"
                type="monotone"
                stroke="var(--color-price)"
                strokeWidth={1}
                dot={true}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <ChartController records={list} onRangeChange={onRangeChange} />
    </div>
  );
}
