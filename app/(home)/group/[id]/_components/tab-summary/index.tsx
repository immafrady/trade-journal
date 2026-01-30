import { BottomBar } from "./bottom-bar";
import { useGroupSummary } from "@/lib/services/group/hooks/use-group-summary";
import React from "react";
import { GroupInfoContext } from "@/app/(home)/group/[id]/_providers/group-info";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import { formatMoney, formatPercent } from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const TabSummary = () => {
  const group = React.useContext(GroupInfoContext)!;
  const summary = useGroupSummary(group);
  return (
    <>
      <div className={"relative common-layout flex flex-col items-center"}>
        <div className={"w-full max-w-md"}>
          <SectionLayout>
            <SimpleDisplayVertical title={"投入成本"}>
              {formatMoney(summary.totalAmount)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"组合预算"}>
              {formatMoney(group.budget)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"剩余预算"}>
              <span
                className={cn(summary.budgetDiff < 0 && "text-destructive")}
              >
                {formatMoney(summary.budgetDiff)}
              </span>
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"预算使用率"}>
              <span
                className={cn(summary.budgetDiff < 0 && "text-destructive")}
              >
                {formatPercent(summary.budgetPct)}
              </span>
            </SimpleDisplayVertical>
          </SectionLayout>
          <Separator className={"my-2 md:my-4"} />
        </div>
      </div>
      <BottomBar></BottomBar>
    </>
  );
};

const SectionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section
      className={
        "grid justify-center place-items-center gap-2 grid-cols-2 md:grid-cols-4"
      }
    >
      {children}
    </section>
  );
};
