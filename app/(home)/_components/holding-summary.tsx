import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoldingSummaryContext } from "@/app/(home)/_components/holding-summary-provider";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { formatMoney, formatPercent } from "@/lib/market-utils";

export const HoldingSummary = () => {
  const { map } = React.useContext(HoldingSummaryContext);
  const data = Object.values(map).reduce(
    (prev, curr) => {
      return {
        totalAmount: prev.totalAmount + curr.totalAmount,
        maxTotalAmount: prev.maxTotalAmount + curr.maxTotalAmount,
      };
    },
    {
      totalAmount: 0,
      maxTotalAmount: 0,
    },
  );
  return (
    <Card className={"py-4"}>
      <CardContent>
        <h3 className={"font-medium text-lg mb-2"}>账户总览</h3>
        <InlineDisplay
          className={"gap-0.5"}
          list={[
            { title: "总仓位", content: formatMoney(data.totalAmount) },
            { title: "最高仓位", content: formatMoney(data.maxTotalAmount) },
            {
              title: "仓位百分位",
              content: formatPercent(
                (data.totalAmount / data.maxTotalAmount) * 100,
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
