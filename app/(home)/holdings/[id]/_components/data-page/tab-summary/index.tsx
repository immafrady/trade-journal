import {
  computeHoldingProfit,
  HoldingProfit,
  useTradeRecordDataById,
} from "@/lib/services/trade-records";
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
import { SinaStockType, SinaTicker } from "@/lib/services/sina";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TabSummary = () => {
  const { id, data } = React.useContext(HoldingInfoContext)!;
  const { summary, latestProfit } = useTradeRecordDataById(id);
  const [index, setIndex] = React.useState(0);
  const profitList = React.useMemo(() => {
    const list = [
      {
        label: "当前估值",
        profit: latestProfit,
      },
    ];
    if (data?.quote) {
      if (SinaStockType.AShare !== data.ticker.type) {
        list.push({
          label: "场外估值",
          profit: computeHoldingProfit(
            data.quote.fundDate!,
            data.quote.fundNav!,
            summary,
          ),
        });
      }
      list.unshift({
        label: "场内估值",
        profit: computeHoldingProfit(
          data.quote.time!,
          data.quote.current!,
          summary,
        ),
      });
    }
    return list;
  }, [latestProfit, data?.quote, data?.ticker.type, summary]);

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
              {formatMoney(summary.remainingCost)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"当前持仓份额"}>
              {formatShares(summary.shares)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"剩余持仓摊薄成本"}>
              {data!.ticker.formatter(summary.costPrice)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"历史资金成本价"}>
              {data!.ticker.formatter(summary.avgPrice)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"当前净投入资金"}>
              {formatMoney(summary.netInvestment)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"历史最高资金占用"}>
              {formatMoney(summary.historicalMaxCapitalOccupied)}
            </SimpleDisplayVertical>

            <SimpleDisplayVertical title={"已实现盈亏"}>
              <span
                className={getTickerChangeColorClass(summary.realizedProfit)}
              >
                {formatMoney(summary.realizedProfit)}
              </span>
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"累计手续费"}>
              {formatMoney(summary.totalFee)}
            </SimpleDisplayVertical>
            {!!summary.totalDividendCount && (
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
            <span className={"font-medium"}>
              {profitList[index % profitList.length].label}
            </span>
            <Button variant={"ghost"} onClick={() => setIndex((i) => i + 1)}>
              <ChevronRight></ChevronRight>
            </Button>
          </div>
          <ProfitBlock
            ticker={data!.ticker}
            profit={profitList[index % profitList.length].profit!}
          ></ProfitBlock>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

const ProfitBlock = ({
  profit,
}: {
  ticker: SinaTicker;
  profit: HoldingProfit;
}) => {
  return (
    <section
      className={"grid justify-center place-items-center gap-2 grid-cols-2"}
    >
      <SimpleDisplayVertical title={"当前持仓市值"}>
        {formatMoney(profit.marketValue)}
      </SimpleDisplayVertical>
      <SimpleDisplayVertical title={"估值日期"}>
        {profit.date}
      </SimpleDisplayVertical>
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
