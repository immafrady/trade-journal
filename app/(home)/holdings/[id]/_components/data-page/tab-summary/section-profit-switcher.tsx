import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import {
  useHoldingProfitById,
  useHoldingQuoteById,
  useHoldingSummaryById,
  useLatestTradeRecordById,
} from "@/lib/services/composed/holding-detail-provider";
import { computeHoldingProfit, HoldingProfit } from "@/lib/compute";
import { SinaStockType } from "@/lib/services/sina";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";

export const SectionProfitSwitcher = React.memo(({ id }: { id: string }) => {
  const { ticker } = React.useContext(HoldingInfoContext)!;
  const summary = useHoldingSummaryById(id);
  const quote = useHoldingQuoteById(id);
  const profit = useHoldingProfitById(id);
  const latest = useLatestTradeRecordById(id);

  const [index, setIndex] = React.useState(0);

  const profitList = React.useMemo(() => {
    if (!summary) return [];

    const list: { label: string; date: string; profit: HoldingProfit }[] = [];

    if (latest) {
      list.push({
        label: "当前估值",
        date: latest.display.tradedAt,
        profit: computeHoldingProfit(latest.derived.price, summary),
      });
    }

    if (quote) {
      if (SinaStockType.AShare !== ticker.type) {
        list.push({
          label: "场外估值",
          date: quote.fundDate!,
          profit: computeHoldingProfit(quote.fundNav!, summary),
        });
      }

      list.unshift({
        label: "场内估值",
        date: quote.date!,
        profit: profit!,
      });
    }

    return list;
  }, [latest, quote, summary, ticker.type, profit]);

  const current = profitList.length
    ? profitList[index % profitList.length]
    : null;
  if (!current) return null;

  return (
    <>
      <Separator className="my-2 md:my-4" />
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          onClick={() =>
            setIndex((i) => (i - 1 + profitList.length) % profitList.length)
          }
        >
          <ChevronLeft />
        </Button>
        <span className="font-medium">{current.label}</span>
        <Button
          variant="ghost"
          onClick={() => setIndex((i) => (i + 1) % profitList.length)}
        >
          <ChevronRight />
        </Button>
      </div>
      <ProfitBlock date={current.date} profit={current.profit} />
    </>
  );
});
SectionProfitSwitcher.displayName = "SectionProfitSwitcher";

const ProfitBlock = ({
  date,
  profit,
}: {
  date: string;
  profit: HoldingProfit;
}) => {
  return (
    <section
      className={"grid justify-center place-items-center gap-2 grid-cols-2"}
    >
      <SimpleDisplayVertical title={"当前持仓市值"}>
        {formatMoney(profit.marketValue)}
      </SimpleDisplayVertical>
      <SimpleDisplayVertical title={"估值日期"}>{date}</SimpleDisplayVertical>
      <SimpleDisplayVertical title={"剩余持仓浮动盈亏"}>
        <span className={getTickerChangeColorClass(profit.unrealizedProfit)}>
          {formatMoney(profit.unrealizedProfit)}
        </span>
      </SimpleDisplayVertical>
      <SimpleDisplayVertical title={"总盈亏"}>
        <span className={getTickerChangeColorClass(profit.totalProfit)}>
          {formatMoney(profit.totalProfit)}
        </span>
      </SimpleDisplayVertical>
      <SimpleDisplayVertical title={"剩余持仓浮动盈亏"}>
        <span className={getTickerChangeColorClass(profit.unrealizedProfit)}>
          {formatPercent(profit.holdingReturnPct)}
        </span>
      </SimpleDisplayVertical>
      <SimpleDisplayVertical title={"整体回报率"}>
        <span className={getTickerChangeColorClass(profit.totalProfit)}>
          {formatPercent(profit.totalReturnPct)}
        </span>
      </SimpleDisplayVertical>
    </section>
  );
};
