import { BottomBar } from "./bottom-bar";
import React from "react";
import { GroupInfoContext } from "@/app/(home)/groups/[id]/_providers";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TickerCard } from "@/components/ui/my/ticker-card";
import { useHoldingSummary } from "@/lib/services/composed/use-holdings-summary";
import { useDailyProfit } from "@/lib/services/composed/use-daily-profit";
import { CommonConstants } from "@/lib/constants";

export const TabSummary = () => {
  const group = React.useContext(GroupInfoContext)!;
  const summary = useHoldingSummary(group.holdingIds!);
  const budgetDiff = group.budget
    ? group.budget - summary.totalNetInvestment
    : 0;
  const budgetPct = group.budget
    ? (summary.totalNetInvestment / group.budget) * 100
    : 0;
  const daily = useDailyProfit(group.holdingIds!);
  return (
    <>
      <div className={"relative common-layout flex flex-col items-center"}>
        <div className={"w-full max-w-md"}>
          {daily && (
            <>
              <SectionLayout
                list={[
                  {
                    title: "本日收益额",
                    content: (
                      <span
                        className={getTickerChangeColorClass(daily.totalDiff)}
                      >
                        {formatMoney(daily.totalDiff)}
                      </span>
                    ),
                  },
                  {
                    title: "本日收益率",
                    content: (
                      <span
                        className={getTickerChangeColorClass(daily.totalDiff)}
                      >
                        {formatPercent(daily.totalPct)}
                      </span>
                    ),
                  },
                ]}
              ></SectionLayout>
              <Separator className={"my-2 md:my-4"} />
            </>
          )}
          <SectionLayout
            list={[
              {
                title: "当前市值",
                content: formatMoney(summary.totalMarketValue),
              },
              {
                title: "收益率",
                content:
                  summary.totalNetInvestment < 0 ? (
                    <span className={getTickerChangeColorClass(1)}>
                      {CommonConstants.InvestmentIsRecovered}
                    </span>
                  ) : (
                    <span
                      className={getTickerChangeColorClass(
                        summary.totalProfitPct,
                      )}
                    >
                      {formatPercent(summary.totalProfitPct)}
                    </span>
                  ),
              },

              {
                title: "历史最高资金占用",
                content: formatMoney(summary.historicalMaxCapitalOccupied),
              },
              {
                title: "浮动盈亏",
                content: (
                  <span
                    className={getTickerChangeColorClass(summary.totalProfit)}
                  >
                    {formatMoney(summary.totalProfit)}
                  </span>
                ),
              },
              {
                title: "已实现盈亏",
                content: (
                  <span
                    className={getTickerChangeColorClass(
                      summary.totalRealizedProfit,
                    )}
                  >
                    {formatMoney(summary.totalRealizedProfit)}
                  </span>
                ),
              },
              {
                title: "未实现盈亏",
                content: (
                  <span
                    className={getTickerChangeColorClass(
                      summary.totalUnrealizedProfit,
                    )}
                  >
                    {formatMoney(summary.totalUnrealizedProfit)}
                  </span>
                ),
              },
            ]}
          ></SectionLayout>
          <Separator className={"my-2 md:my-4"} />
          <SectionLayout
            list={[
              {
                title: "净投入资金",
                content: formatMoney(summary.totalNetInvestment),
              },
              {
                title: "组合预算",
                content: formatMoney(group.budget),
              },
              {
                title: "剩余预算",
                content: (
                  <span className={cn(budgetDiff < 0 && "text-destructive")}>
                    {formatMoney(budgetDiff)}
                  </span>
                ),
              },
              {
                title: "预算使用率",
                content: (
                  <span className={cn(budgetDiff < 0 && "text-destructive")}>
                    {formatPercent(budgetPct)}
                  </span>
                ),
              },
            ]}
          ></SectionLayout>
          <Separator className={"my-2 md:my-4"} />
          <h5 className={"text-center my-2"}>持仓明细</h5>
          <div className={"flex flex-col gap-2"}>
            {summary.holdings.map((s) => (
              <TickerCard
                key={s.id}
                id={s.id}
                ticker={s.ticker}
                weightPct={s.weightPct}
                profit={s.profit}
                daily={daily?.holdingMap[s.id]}
              ></TickerCard>
            ))}
          </div>
        </div>
      </div>
      <BottomBar></BottomBar>
    </>
  );
};

const SectionLayout = ({
  list,
}: {
  list: { title: string; content: React.ReactNode }[];
}) => {
  return (
    <section
      className={"grid justify-center place-items-center gap-2 grid-cols-2"}
    >
      {list.map((item) => (
        <SimpleDisplayVertical key={item.title} title={item.title}>
          {item.content}
        </SimpleDisplayVertical>
      ))}
    </section>
  );
};
