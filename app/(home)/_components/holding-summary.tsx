import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { formatMoney, getTickerChangeColorClass } from "@/lib/market-utils";
import { HomeContext } from "@/app/(home)/_provider";

export const HoldingSummary = () => {
  const { totalMarketValue, totalProfit } = React.useContext(HomeContext);
  return (
    <Card className={"py-4"}>
      <CardContent>
        <InlineDisplay
          className={"gap-0.5"}
          list={[
            { title: "总市值", content: formatMoney(totalMarketValue) },
            {
              title: "累计收益",
              content: (
                <span className={getTickerChangeColorClass(totalProfit)}>
                  {formatMoney(totalProfit)}
                </span>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
