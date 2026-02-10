import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { useDailyProfit } from "@/lib/services/composed/use-daily-profit";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const SectionDailyProfit = React.memo(({ id }: { id: string }) => {
  const daily = useDailyProfit([id]);
  if (!daily) return null;

  return (
    <>
      <section className="grid justify-center place-items-center gap-2 grid-cols-2">
        <SimpleDisplayVertical title="本日收益额">
          <span className={getTickerChangeColorClass(daily.totalDiff)}>
            {formatMoney(daily.totalDiff)}
          </span>
        </SimpleDisplayVertical>
        <SimpleDisplayVertical title="本日收益率">
          <span className={getTickerChangeColorClass(daily.totalDiff)}>
            {formatPercent(daily.totalPct)}
          </span>
        </SimpleDisplayVertical>
      </section>
      <Separator className="my-2 md:my-4" />
    </>
  );
});
SectionDailyProfit.displayName = "SectionDailyProfit";
