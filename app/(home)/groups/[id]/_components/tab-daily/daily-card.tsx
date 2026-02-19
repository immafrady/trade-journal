import React from "react";
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
import { TradeRecordConstants } from "@/lib/services/trade-records";
import { DataPageContext } from "@/app/(home)/groups/[id]/_providers";
import { TabKey } from "../tab-key";
import { DailySummary } from "@/lib/services/composed/use-daily-summary";

export const DailyCard = ({
  daily,
  // ticker,
}: {
  daily: DailySummary;
  // ticker: SinaTicker;
}) => {
  const { setTabKey, setColumnFilters } = React.useContext(DataPageContext);
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
                onClick={() => {
                  const date = daily.date.toDate();
                  setColumnFilters([
                    {
                      id: TradeRecordConstants.TradedAt,
                      value: [date, date],
                    },
                  ]);
                  setTabKey(TabKey.Table);
                }}
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
                // {
                //   title: TradeRecordConstants.CumulativeCostPrice,
                //   content: ticker.formatter(latest.cumulative.costPrice),
                // },
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
