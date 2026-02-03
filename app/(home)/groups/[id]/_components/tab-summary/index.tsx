import { BottomBar } from "./bottom-bar";
import { useGroupSummary } from "@/lib/services/group";
import React from "react";
import { GroupInfoContext } from "@/app/(home)/groups/[id]/_providers/group-info";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import {
  formatFund,
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HoldingCard } from "@/app/(home)/groups/[id]/_components/tab-summary/holding-card";

export const TabSummary = () => {
  const group = React.useContext(GroupInfoContext)!;
  const summary = useGroupSummary(group);
  return (
    <>
      <div className={"relative common-layout flex flex-col items-center"}>
        <div className={"w-full max-w-md"}>
          <SectionLayout
            list={[
              {
                title: "投入成本",
                content: formatMoney(summary.totalAmount),
              },
              {
                title: "组合预算",
                content: formatMoney(group.budget),
              },
              {
                title: "剩余预算",
                content: (
                  <span
                    className={cn(summary.budgetDiff < 0 && "text-destructive")}
                  >
                    {formatMoney(summary.budgetDiff)}
                  </span>
                ),
              },
              {
                title: "预算使用率",
                content: (
                  <span
                    className={cn(summary.budgetDiff < 0 && "text-destructive")}
                  >
                    {formatPercent(summary.budgetPct)}
                  </span>
                ),
              },
            ]}
          ></SectionLayout>
          <Separator className={"my-2 md:my-4"} />
          <SectionLayout
            list={[
              {
                title: "当前市值",
                content: formatMoney(summary.marketValue),
              },
              {
                title: "浮动盈亏",
                content: (
                  <span
                    className={getTickerChangeColorClass(summary.valueDiff)}
                  >
                    {formatMoney(summary.valueDiff)}
                  </span>
                ),
              },
              {
                title: "盈亏指数",
                content: formatFund(summary.valueIndex),
              },
              {
                title: "收益率",
                content: (
                  <span
                    className={getTickerChangeColorClass(summary.valueDiff)}
                  >
                    {formatPercent(summary.valuePct)}
                  </span>
                ),
              },
            ]}
          ></SectionLayout>
          <Separator className={"my-2 md:my-4"} />
          <h5 className={"text-center my-2"}>持仓明细</h5>
          <div className={"flex flex-col gap-2"}>
            {summary.summaries.map((s) => (
              <HoldingCard key={s.id} summary={s}></HoldingCard>
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
      className={
        "grid justify-center place-items-center gap-2 grid-cols-2 md:grid-cols-4"
      }
    >
      {list.map((item) => (
        <SimpleDisplayVertical key={item.title} title={item.title}>
          {item.content}
        </SimpleDisplayVertical>
      ))}
    </section>
  );
};
