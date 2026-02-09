import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import {
  formatMoney,
  formatPercent,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import { Separator } from "@/components/ui/separator";
import { BottomBar } from "@/app/(home)/holdings/[id]/_components/data-page/tab-summary/bottom-bar";
import { SinaStockType } from "@/lib/services/sina";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useHoldingProfitById,
  useHoldingQuoteById,
  useHoldingSummaryById,
  useLatestTradeRecordById,
} from "@/lib/services/composed/holding-detail-provider";
import { computeHoldingProfit, HoldingProfit } from "@/lib/compute";

export const TabSummary = () => {
  const { id, ticker } = React.useContext(HoldingInfoContext)!;
  const summary = useHoldingSummaryById(id);
  const quote = useHoldingQuoteById(id);
  const profit = useHoldingProfitById(id);
  const latest = useLatestTradeRecordById(id);

  const [index, setIndex] = React.useState(0);
  const profitList = React.useMemo(() => {
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

  const currentProfit = profitList.length
    ? profitList[index % profitList.length]
    : undefined;
  return (
    <>
      <div className={"relative common-layout flex flex-col items-center"}>
        <div className={"w-full max-w-md"}>
          <section
            className={
              "grid justify-center place-items-center gap-2 grid-cols-2"
            }
          >
            <SimpleDisplayVertical title={"剩余持仓成本"}>
              {formatMoney(summary?.remainingCost)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"当前持仓份额"}>
              {formatShares(summary?.shares)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"剩余持仓摊薄成本"}>
              {ticker.formatter(summary?.costPrice)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"历史资金成本价"}>
              {ticker.formatter(summary?.avgPrice)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"当前净投入资金"}>
              {formatMoney(summary?.netInvestment)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"历史最高资金占用"}>
              {formatMoney(summary?.historicalMaxCapitalOccupied)}
            </SimpleDisplayVertical>

            <SimpleDisplayVertical title={"已实现盈亏"}>
              <span
                className={getTickerChangeColorClass(
                  summary?.realizedProfit ?? 0,
                )}
              >
                {formatMoney(summary?.realizedProfit)}
              </span>
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"累计手续费"}>
              {formatMoney(summary?.totalFee)}
            </SimpleDisplayVertical>
            {!!summary?.totalDividendCount && (
              <>
                <SimpleDisplayVertical title={"累计分红金额"}>
                  {formatMoney(summary.totalDividend)}
                </SimpleDisplayVertical>
                <SimpleDisplayVertical title={"累计分红次数"}>
                  {summary.totalDividendCount}
                </SimpleDisplayVertical>
              </>
            )}
          </section>
          {currentProfit ? (
            <>
              <Separator className={"my-2 md:my-4"} />
              <div className={"flex justify-center items-center"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setIndex((i) => {
                      i--;
                      if (i < 0) i = profitList.length - 1;
                      return i;
                    })
                  }
                >
                  <ChevronLeft></ChevronLeft>
                </Button>
                <span className={"font-medium"}>{currentProfit.label}</span>
                <Button
                  variant={"ghost"}
                  onClick={() => setIndex((i) => i + 1)}
                >
                  <ChevronRight></ChevronRight>
                </Button>
              </div>
              <ProfitBlock
                date={currentProfit.date!}
                profit={currentProfit.profit!}
              ></ProfitBlock>
            </>
          ) : null}
        </div>
      </div>
      <BottomBar />
    </>
  );
};

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
