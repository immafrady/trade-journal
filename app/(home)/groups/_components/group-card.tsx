import { GroupModel } from "@/lib/services/group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { Separator } from "@/components/ui/separator";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { useHoldingSummary } from "@/lib/services/composed/use-holdings-summary";
import { useDailyProfit } from "@/lib/services/composed/use-daily-profit";

export const GroupCard = ({ group }: { group: GroupModel }) => {
  const router = useRouter();
  const summary = useHoldingSummary(group.holdingIds!);
  const daily = useDailyProfit(group.holdingIds!);
  const diplayList = React.useMemo(() => {
    const list = [
      {
        title: "总市值",
        content: formatMoney(summary.totalMarketValue),
      },
      {
        title: "投入/预算",
        content: `${formatMoney(summary.totalNetInvestment)}/${formatMoney(group.budget)}`,
      },
      {
        title: "浮盈/收益率",
        content: (
          <div className={getTickerChangeColorClass(summary.totalProfit!)}>
            {formatMoney(summary.totalProfit)}/
            {formatPercent(summary.totalProfitPct)}
          </div>
        ),
      },
    ];
    if (daily) {
      list.push({
        title: "本日收益/率",
        content: (
          <div className={getTickerChangeColorClass(daily.totalDiff)}>
            {formatMoney(daily.totalDiff)}/{formatPercent(daily.totalPct)}
          </div>
        ),
      });
    }
    return list;
  }, [
    summary.totalMarketValue,
    summary.totalNetInvestment,
    summary.totalProfit,
    summary.totalProfitPct,
    group.budget,
    daily,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>{group.label}</div>
          <LoadingButton
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              router.push(`/groups/${group.id!}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InlineDisplay list={diplayList}></InlineDisplay>
        <Separator className={"my-2"}></Separator>
        <h5 className={"font-medium text-sm"}>市值占比</h5>
        <div className={"flex flex-col gap-1"}>
          {summary.holdings.map((s) => (
            <div
              key={s.id}
              className={"flex items-center justify-between text-sm"}
            >
              <div className={"flex items-center gap-1"}>
                <SinaStockTypeBadge type={s.ticker.type} />
                {s.ticker.label}
              </div>
              <div className={"font-mono"}>{formatPercent(s.weightPct)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
