import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { formatMoney, getTickerChangeColorClass } from "@/lib/market-utils";
import { HoldingsSummaryDetail } from "@/lib/services/composed/use-holdings-summary";

export const HoldingSummary = ({
  summary,
}: {
  summary: HoldingsSummaryDetail;
}) => {
  return (
    <Card className={"py-4"}>
      <CardContent>
        <InlineDisplay
          className={"gap-0.5"}
          list={[
            { title: "总市值", content: formatMoney(summary.totalMarketValue) },
            {
              title: "累计收益",
              content: (
                <span
                  className={getTickerChangeColorClass(summary.totalProfit)}
                >
                  {formatMoney(summary.totalProfit)}
                </span>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
