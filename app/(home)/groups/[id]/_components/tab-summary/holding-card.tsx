import { GroupHoldingSummary } from "@/lib/services/group/hooks/use-group-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { formatFund, formatMoney, formatPercent } from "@/lib/market-utils";

export const HoldingCard = ({ summary }: { summary: GroupHoldingSummary }) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>
            <SinaStockTypeBadge type={summary.ticker.type} />
            {summary.ticker.label}
          </div>
          <LoadingButton
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              router.push(`/holdings/${summary.id!}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InlineDisplay
          list={[
            {
              title: "持仓占比",
              content: formatPercent(summary.ratio),
            },
            {
              title: `持仓市值（${summary.realtime ? "实时" : "离线"}）`,
              content: formatMoney(summary.marketValue),
            },
            {
              title: "盈亏指数",
              content: formatFund(summary.latest?.cumulative.valueIndex),
            },
          ]}
        ></InlineDisplay>
      </CardContent>
    </Card>
  );
};
