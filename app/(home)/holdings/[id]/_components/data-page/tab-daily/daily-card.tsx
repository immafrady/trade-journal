import React from "react";
import { DailySummary } from "@/lib/services/composed/use-daily-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatPercent,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { SinaTicker } from "@/lib/services/sina";
import { Separator } from "@/components/ui/separator";
import { SelectedSummary } from "@/app/(home)/holdings/[id]/_components/data-page/selected-summary";
import { TradeRecordConstants } from "@/lib/services/trade-records";

export const DailyCard = ({
  daily,
  ticker,
}: {
  daily: DailySummary;
  ticker: SinaTicker;
}) => {
  const records = daily.records.map((r) => r.record);
  const latest = records[0];
  const diff = latest.cumulative.marketValue - latest.cumulative.totalAmount;
  const pct = latest.cumulative.totalAmount
    ? (diff / latest.cumulative.totalAmount) * 100
    : undefined;

  return (
    <div className="relative common-layout flex flex-col items-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className={"flex items-center justify-between"}>
              <div className={"flex items-center gap-1"}>
                {daily.date.format("YYYY-MM-DD")}
              </div>
              <LoadingButton
                variant={"ghost"}
                icon={<ArrowRight />}
                onClick={() => {}}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className={"font-medium mb-2"}>当日操作完成后</h3>
            <InlineDisplay
              list={[
                {
                  title: TradeRecordConstants.CumulativeTotalShares,
                  content: formatShares(latest.cumulative.totalShares),
                },
                {
                  title: TradeRecordConstants.CumulativeCostPrice,
                  content: ticker.formatter(latest.cumulative.costPrice),
                },
                {
                  title: TradeRecordConstants.CumulativeMarketValue,
                  content: formatMoney(latest.cumulative.marketValue),
                },

                {
                  title: TradeRecordConstants.CumulativeTotalAmount,
                  content: formatMoney(latest.cumulative.totalAmount),
                },
                {
                  title: "收益率",
                  content: (
                    <span className={getTickerChangeColorClass(diff)}>
                      {formatPercent(pct)}
                    </span>
                  ),
                },
              ]}
            ></InlineDisplay>
            <Separator className={"my-4"}></Separator>
            <SelectedSummary records={records}></SelectedSummary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
