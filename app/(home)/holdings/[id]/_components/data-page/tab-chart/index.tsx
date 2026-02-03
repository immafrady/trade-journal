// "use client";
//
// import {
//   Bar,
//   CartesianGrid,
//   ComposedChart,
//   Line,
//   ReferenceLine,
//   XAxis,
//   YAxis,
// } from "recharts";
//
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { ChartController } from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart/chart-controller";
// import React from "react";
// import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
// import {
//   TradeRecordChart,
//   useTradeRecordChart,
// } from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart/use-trade-record-chart";
// import { formatShares } from "@/lib/market-utils";
// import { SinaStockType } from "@/lib/services/sina";
// import { useTradeRecordDataById } from "@/lib/services/trade-records";
//
// const chartConfig = {
//   price: {
//     label: "价格",
//     color: "var(--chart-1)",
//   },
//   shares: {
//     label: "份额",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig;
//
// export function TabChart() {
//   const { id, data } = React.useContext(HoldingInfoContext)!;
//   const list = useTradeRecordChart(id);
//   const { summary } = useTradeRecordDataById(id);
//   const [records, setRecords] = React.useState<TradeRecordChart[]>([]);
//   const onRangeChange = React.useCallback((record: TradeRecordChart[]) => {
//     setRecords(record);
//   }, []);
//
//   const [priceYDomain, setPriceYDomain] = React.useState([0, 100]);
//   const [sharesYDomain, setSharesYDomain] = React.useState([0, 100]);
//
//   React.useEffect(() => {
//     // 金额
//     const prices = [
//       data?.quote?.fundNav as number,
//       data?.quote?.current as number,
//       ...records.map((d) => +d.price),
//     ].filter(Boolean);
//     let min = Math.min(...prices);
//     let max = Math.max(...prices);
//     let padding = (max - min) * 0.1;
//     setPriceYDomain([min - padding, max + padding]);
//     // 份额
//     const shares = [
//       summary.maxTotalShares,
//       ...records.map((d) => +d.shares),
//     ].filter(Boolean);
//     min = Math.min(...shares);
//     max = Math.max(...shares);
//     padding = (max - min) * 0.1;
//     setSharesYDomain([min - padding < 0 ? 0 : min - padding, max + padding]);
//   }, [data?.quote, records, summary.maxTotalShares]);
//
//   const [counter, setCounter] = React.useState(0);
//   const [refValue, setRefValue] = React.useState<number | undefined>();
//   const [refLabel, setRefLabel] = React.useState<string | undefined>();
//   const refCallback = React.useCallback(
//     (count: number) => {
//       if (!data) return;
//
//       if (data.ticker.type === SinaStockType.AShare) {
//         setRefValue(data.quote?.current);
//         setRefLabel(`当前价格: ${data.ticker.formatter(data?.quote?.current)}`);
//         return;
//       }
//
//       // 非 A 股的切换逻辑
//       if (count % 2 === 0) {
//         setRefValue(data.quote?.current);
//         setRefLabel(`场内价格: ${data.ticker.formatter(data?.quote?.current)}`);
//       } else {
//         setRefValue(data.quote?.fundNav);
//         setRefLabel(`场外价格: ${data.ticker.formatter(data?.quote?.fundNav)}`);
//       }
//     },
//     [data],
//   );
//
//   React.useEffect(() => {
//     // 初次执行
//     refCallback(counter);
//     const timer = setInterval(() => {
//       setCounter((c) => {
//         const next = c + 1;
//         refCallback(next); // 使用更新后的 counter
//         return next;
//       });
//     }, 2000);
//
//     return () => clearInterval(timer);
//   }, [refCallback]);
//
//   return (
//     <div className={"flex flex-col gap-2"}>
//       <Card>
//         <CardHeader>
//           <CardTitle>历史收益变化</CardTitle>
//           {records && records.length && (
//             <CardDescription>
//               {records[0].tradedAt} 至 {records[records.length - 1].tradedAt}
//             </CardDescription>
//           )}
//         </CardHeader>
//         <CardContent>
//           <ChartContainer
//             config={chartConfig}
//             className="min-h-[200px] max-h-[400px] w-full"
//           >
//             <ComposedChart
//               accessibilityLayer
//               data={records}
//               margin={{
//                 top: 10,
//                 bottom: 5,
//               }}
//               height={500}
//             >
//               <CartesianGrid vertical={false} />
//               <XAxis
//                 dataKey="tradedAt"
//                 tickLine={true}
//                 axisLine={true}
//                 tickMargin={4}
//                 interval={"preserveStartEnd"}
//               />
//               <ChartTooltip
//                 cursor={true}
//                 content={
//                   <ChartTooltipContent
//                     valueFormatterMap={{
//                       shares: formatShares,
//                       price: data?.ticker.formatter,
//                     }}
//                   />
//                 }
//               />
//               <Bar
//                 yAxisId="left"
//                 dataKey="shares"
//                 fill="var(--color-shares)"
//                 radius={2}
//               />
//               <Line
//                 yAxisId="right"
//                 dataKey="price"
//                 type="monotone"
//                 stroke="var(--color-price)"
//                 strokeWidth={1}
//                 dot={true}
//               />
//               {refValue && (
//                 <ReferenceLine
//                   y={refValue}
//                   yAxisId="right"
//                   label={{ value: refLabel }}
//                   stroke={"var(--color-price)"}
//                   strokeDasharray={"3 3"}
//                   position={"end"}
//                 />
//               )}
//               {summary.maxTotalShares && (
//                 <ReferenceLine
//                   y={summary.maxTotalShares}
//                   yAxisId="left"
//                   label={{
//                     value: `最高仓位: ${formatShares(summary.maxTotalShares)}`,
//                     position: "insideTopLeft",
//                   }}
//                   stroke={"var(--color-shares)"}
//                   position={"end"}
//                 />
//               )}
//               <YAxis
//                 yAxisId="left"
//                 domain={sharesYDomain}
//                 mirror={true}
//                 tickFormatter={(v) => formatShares(v)}
//               />
//               <YAxis
//                 yAxisId="right"
//                 orientation="right"
//                 mirror={true}
//                 tickFormatter={(v) => data?.ticker.formatter(v) ?? v}
//                 domain={priceYDomain}
//               />
//               <ChartLegend content={<ChartLegendContent />} />
//             </ComposedChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>
//       <ChartController records={list} onRangeChange={onRangeChange} />
//     </div>
//   );
// }
