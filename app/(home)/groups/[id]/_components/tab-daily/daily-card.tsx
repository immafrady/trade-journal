import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import { TradeRecordConstants } from "@/lib/services/trade-records";
import {
  DataPageContext,
  GroupInfoContext,
} from "@/app/(home)/groups/[id]/_providers";
import { TabKey } from "../tab-key";
import { DailySummary } from "@/lib/services/composed/use-daily-summary";
import { useTickerMap } from "@/lib/services/holdings/use-ticker-map";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";

export const DailyCard = ({ daily }: { daily: DailySummary }) => {
  const { setTabKey, setColumnFilters } = React.useContext(DataPageContext);
  const tickerMap = useTickerMap();
  const { holdingIds = [] } = React.useContext(GroupInfoContext)!;
  const latest = daily.records.at(-1)!;

  let totalAmount = 0;
  daily.records.forEach((tre) => {
    totalAmount += tre.record.adjusted.amount;
  });

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
            <InlineDisplay
              list={[
                {
                  title: TradeRecordConstants.CumulativeTotalAmount,
                  content: formatMoney(latest.group.totalAmount),
                },
                {
                  title: "当日净投入",
                  content: (
                    <span className={getTickerChangeColorClass(totalAmount)}>
                      {formatMoney(totalAmount)}
                    </span>
                  ),
                },
                {
                  title: "当日交易次数",
                  content: daily.records.length,
                },
              ]}
            />
            <Separator className={"my-2"} />
            {holdingIds.map((id, idx) => {
              const ticker = tickerMap[id];
              const prev = daily.prevShares[id];
              const curr = daily.currentShares[id];
              const diff = curr - prev;
              return (
                <div className={"not-last:mb-2"} key={id}>
                  <h4 className={"font-medium flex items-center gap-1 mb-0.5"}>
                    <SinaStockTypeBadge type={ticker.type} />
                    {ticker.label}
                  </h4>
                  <InlineDisplay
                    list={[
                      {
                        title: "前日份额",
                        content: formatShares(prev),
                      },
                      {
                        title: "当日份额",
                        content: formatShares(curr),
                      },
                      {
                        title: "份额变化",
                        content: (
                          <span className={getTickerChangeColorClass(diff)}>
                            {diff > 0 ? "+" : ""}
                            {formatShares(diff)}
                          </span>
                        ),
                      },
                      {
                        title: "操作次数",
                        content: daily.records.filter(
                          (r) => r.ticker.code === ticker.code,
                        ).length,
                      },
                    ]}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
