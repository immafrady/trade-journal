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
          list={[
            { title: "总市值", content: formatMoney(summary.totalMarketValue) },
            {
              title: "累计收益/率",
              content: (
                <span
                  className={getTickerChangeColorClass(summary.totalProfit)}
                >
                  {formatMoney(summary.totalProfit)}/
                  <span className={"text-xs"}>
                    {formatPercent(summary.totalProfitPct)}
                  </span>
                </span>
              ),
            },
          ]}
        />
        {daily && (
          <InlineDisplay
            list={[
              {
                title: "本日收益/率",
                content: (
                  <span className={getTickerChangeColorClass(daily.totalDiff)}>
                    {formatMoney(daily.totalDiff)}/
                    <span className={"text-xs"}>
                      {formatPercent(daily.totalPct)}
                    </span>
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
