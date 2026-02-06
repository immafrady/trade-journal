import { SinaTicker } from "@/lib/services/sina";
import { HoldingProfit, HoldingSummary } from "@/lib/services/trade-records";
import { useHoldingDetailList } from "@/lib/services/composed/holding-detail-provider";
import { useTickerMap } from "@/lib/services/holdings/use-ticker-map";

export const useHoldingSummary = (holdingIds: string[]) => {
  const map = useTickerMap();
  const holdingDetails = useHoldingDetailList(holdingIds);

  let totalMarketValue = 0;
  let totalRemainingCost = 0;
  let totalNetInvestment = 0;
  let totalRealizedProfit = 0;
  let totalUnrealizedProfit = 0;
  let totalProfit = 0;
  let historicalMaxCapitalOccupied = 0;

  const holdings: GroupHoldingSummary[] = [];
  for (const detail of holdingDetails) {
    const summary = detail.summary;
    const profit = detail.profit;

    totalMarketValue += profit?.marketValue ?? 0;
    totalRemainingCost += summary.remainingCost;
    totalNetInvestment += summary.netInvestment;
    totalRealizedProfit += summary.realizedProfit;
    totalUnrealizedProfit += profit?.unrealizedProfit ?? 0;
    totalProfit += profit?.totalProfit ?? 0;
    historicalMaxCapitalOccupied += summary.historicalMaxCapitalOccupied;

    holdings.push({
      id: detail.id,
      ticker: map[detail.id],
      summary,
      profit,
      weightPct: 0,
      offline: !detail.quote,
    });
  }

  return {
    /** 市值（需要外部传入最新价格后再算） */
    totalMarketValue,

    /** 真实持仓成本 */
    totalRemainingCost,

    /** 净投入资金（组合维度） */
    totalNetInvestment,

    /** 已实现盈亏 */
    totalRealizedProfit,

    /** 未实现盈亏 */
    totalUnrealizedProfit,

    /** 总盈亏（已实现 + 未实现） */
    totalProfit,

    /** 收益率（按净投入算） */
    totalProfitPct:
      totalNetInvestment > 0 ? (totalProfit / totalNetInvestment) * 100 : 0,

    /** 历史最高资金占用 */
    historicalMaxCapitalOccupied,

    holdings: holdings
      .map((item) => ({
        ...item,
        weightPct: ((item.profit?.marketValue ?? 0) / totalMarketValue) * 100,
      }))
      .sort((a, b) => b.weightPct - a.weightPct),
  };
};

export interface GroupHoldingSummary {
  id: string;
  ticker: SinaTicker;
  summary: HoldingSummary;
  profit?: HoldingProfit;
  weightPct: number;
  offline: boolean;
}
