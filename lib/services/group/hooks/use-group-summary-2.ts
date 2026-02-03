import { SinaTicker } from "@/lib/services/sina";
import {
  computeHoldingProfit,
  HoldingProfit,
  HoldingSummary,
  useTradeRecordStore,
} from "@/lib/services/trade-records";
import { GroupModel } from "@/lib/services/group";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";

export const useGroupSummary = (model: GroupModel) => {
  const holdingIds = model.holdingIds ?? [];
  const store = useTradeRecordStore((s) => s.store);
  const holdingsWithQuotes = useHoldingsWithQuote();

  let totalMarketValue = 0;
  let totalRemainingCost = 0;
  let totalNetInvestment = 0;
  let totalRealizedProfit = 0;
  let totalUnrealizedProfit = 0;
  let totalProfit = 0;
  let historicalMaxCapitalOccupied = 0;

  const holdings: GroupHoldingSummary[] = [];
  for (const id of holdingIds) {
    const hwq = holdingsWithQuotes.find((hwq) => hwq.id === id)!;
    const summary = store[id].summary;
    const profit = hwq.quote
      ? computeHoldingProfit(hwq.quote.current!, store[id].summary)
      : store[id].latestProfit;

    totalMarketValue += profit?.marketValue ?? 0;
    totalRemainingCost += summary.remainingCost;
    totalNetInvestment += summary.netInvestment;
    totalRealizedProfit += summary.realizedProfit;
    totalUnrealizedProfit += profit?.unrealizedProfit ?? 0;
    totalProfit += profit?.totalProfit ?? 0;
    historicalMaxCapitalOccupied += summary.historicalMaxCapitalOccupied;

    holdings.push({
      id,
      ticker: hwq.ticker,
      summary,
      profit,
      weightPct: 0,
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

    holdings: holdings.map((item) => ({
      ...item,
      weightPct: ((item.profit?.marketValue ?? 0) / totalMarketValue) * 100,
    })),
  };
};

export interface GroupHoldingSummary {
  id: string;
  ticker: SinaTicker;
  summary: HoldingSummary;
  profit?: HoldingProfit;
  weightPct: number;
}
