import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers";
import { useHoldingSummaryById } from "@/lib/services/composed/holding-detail-provider";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import {
  formatMoney,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";

export const SectionHoldingSummary = React.memo(({ id }: { id: string }) => {
  const { ticker } = React.useContext(HoldingInfoContext)!;
  const summary = useHoldingSummaryById(id);

  if (!summary) return null;

  return (
    <section className="grid justify-center place-items-center gap-2 grid-cols-2">
      <SimpleDisplayVertical title="剩余持仓成本">
        {formatMoney(summary.remainingCost)}
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="当前持仓份额">
        {formatShares(summary.shares)}
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="剩余持仓摊薄成本">
        {ticker.formatter(summary.costPrice)}
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="历史资金成本价">
        {ticker.formatter(summary.avgPrice)}
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="当前净投入资金">
        {formatMoney(summary.netInvestment)}
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="历史最高资金占用">
        {formatMoney(summary.historicalMaxCapitalOccupied)}
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="已实现盈亏">
        <span className={getTickerChangeColorClass(summary.realizedProfit)}>
          {formatMoney(summary.realizedProfit)}
        </span>
      </SimpleDisplayVertical>

      <SimpleDisplayVertical title="累计手续费">
        {formatMoney(summary.totalFee)}
      </SimpleDisplayVertical>

      {!!summary.totalDividendCount && (
        <>
          <SimpleDisplayVertical title="累计分红金额">
            {formatMoney(summary.totalDividend)}
          </SimpleDisplayVertical>
          <SimpleDisplayVertical title="累计分红次数">
            {summary.totalDividendCount}
          </SimpleDisplayVertical>
        </>
      )}
    </section>
  );
});
SectionHoldingSummary.displayName = "SectionHoldingSummary";
