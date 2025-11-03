import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoldingSummaryContext } from "@/app/(home)/_components/holding-summary-provider";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { formatMoney, formatPercent } from "@/lib/market-utils";

export const HoldingSummary = () => {
  const { totalAmount, maxTotalAmount } = React.useContext(
    HoldingSummaryContext,
  );
  return (
    <Card className={"py-4"}>
      <CardContent>
        <h3 className={"font-medium text-lg mb-2"}>账户总览</h3>
        <InlineDisplay
          className={"gap-0.5"}
          list={[
            { title: "总仓位", content: formatMoney(totalAmount) },
            { title: "最高仓位", content: formatMoney(maxTotalAmount) },
            {
              title: "仓位百分位",
              content: formatPercent((totalAmount / maxTotalAmount) * 100),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
