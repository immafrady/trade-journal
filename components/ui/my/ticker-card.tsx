import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { ArrowRight } from "lucide-react";
import { LoadingButton } from "@/components/ui/my/button";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { useRouter } from "next/navigation";
import { SinaTicker } from "@/lib/services/sina";
import { HoldingDailyProfit, HoldingProfit } from "@/lib/compute";

export const TickerCard = ({
  id,
  ticker,
  profit,
  weightPct,
  daily,
}: {
  ticker: SinaTicker;
  id: string;
  profit?: HoldingProfit;
  weightPct: number;
  daily?: HoldingDailyProfit;
}) => {
  // 计算汇总的逻辑

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>
            <SinaStockTypeBadge type={ticker.type} />
            {ticker.label}
          </div>
          <LoadingButton
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              router.push(`/holdings/${id}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {profit && (
          <InlineDisplay
            className={"gap-0.5"}
            list={[
              {
                title: "市值(仓位)",
                content: (
                  <div>
                    {formatMoney(profit.marketValue)}
                    <span className={"text-xs"}>
                      ({formatPercent(weightPct)})
                    </span>
                  </div>
                ),
              },
              {
                title: "累计收益/率",
                content: (
                  <div
                    className={getTickerChangeColorClass(profit.totalProfit)}
                  >
                    {formatMoney(profit?.totalProfit)}/
                    <span className={"text-xs"}>
                      {formatPercent(profit.totalReturnPct)}
                    </span>
                  </div>
                ),
              },
            ]}
          />
        )}
        {daily && (
          <InlineDisplay
            className={"gap-0.5"}
            list={[
              {
                title: "本日收益/率",
                content: (
                  <div className={getTickerChangeColorClass(daily.diff)}>
                    {formatMoney(daily.diff)}/
                    <span className={"text-xs"}>
                      {formatPercent(daily.pct)}
                    </span>
                  </div>
                ),
              },
              {
                title: "当前价格",
                content: (
                  <div className={getTickerChangeColorClass(daily.diff)}>
                    {ticker.formatter(daily.current)}
                  </div>
                ),
              },
            ]}
          ></InlineDisplay>
        )}
      </CardContent>
    </Card>
  );
};
