import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { HoldingsSummaryDetail } from "@/lib/services/composed/use-holdings-summary";
import { PortfolioDailyProfit } from "@/lib/compute";

export const HoldingSummary = ({
  summary,
  daily,
}: {
  summary: HoldingsSummaryDetail;
  daily?: PortfolioDailyProfit | null;
}) => {
  return (
    <Card className={"py-4"}>
      <CardContent>
        <InlineDisplay
          className={"gap-0.5"}
          list={[
            { title: "总市值", content: formatMoney(summary.totalMarketValue) },
            {
              title: "累计收益/率",
              content: (
                <span
                  className={getTickerChangeColorClass(summary.totalProfit)}
                >
                  {formatMoney(summary.totalProfit)}/
                  {formatPercent(summary.totalProfitPct)}
                </span>
              ),
            },
          ]}
        />
        {daily && (
          <InlineDisplay
            className={"gap-0.5"}
            list={[
              {
                title: "本日收益/率",
                content: (
                  <span className={getTickerChangeColorClass(daily.totalDiff)}>
                    {formatMoney(daily.totalDiff)}/
                    {formatPercent(daily.totalPct)}
                  </span>
                ),
              },
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
};
