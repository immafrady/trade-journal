import { DailySummary } from "@/lib/services/composed/use-daily-summary";
import { SinaQuote } from "@/lib/services/sina";

export const computeDailyProfit = (
  dailySummary: DailySummary,
  quoteMap: Record<string, SinaQuote>,
): PortfolioDailyProfit | null => {
  const holdingMap: Record<string, HoldingDailyProfit> = {};

  let totalPrevMarketValue = 0;
  let totalDiff = 0;

  const summaryDateStr = dailySummary.date.format("YYYY-MM-DD");

  for (const holdingId in dailySummary.currentShares) {
    const quote = quoteMap[holdingId];
    if (!quote) return null;

    const currentShares = dailySummary.currentShares[holdingId] ?? 0;
    const isSameDate = summaryDateStr === quote.date;
    const prevShares = isSameDate
      ? (dailySummary.prevShares[holdingId] ?? 0)
      : currentShares;
    const currentMarketValue = currentShares * quote.current!;
    const prevMarketValue = prevShares * quote.prevClose!;

    let diff = 0;
    if (isSameDate) {
      // 当日，得精确计算
      // 真实收益 = 当前总资产 - 昨日总资产 - 今日净投入
      const todayNetInvestment = dailySummary.records.reduce((prev, curr) => {
        if (curr.holdingId === holdingId) {
          return prev + curr.record.adjusted.amount;
        }
        return prev;
      }, 0);
      diff = currentMarketValue - prevMarketValue - todayNetInvestment;
    } else {
      // 非当日，粗略计算
      diff = currentMarketValue - prevMarketValue;
    }

    totalDiff += diff;
    totalPrevMarketValue += prevMarketValue;

    holdingMap[holdingId] = {
      currentMarketValue,
      prevMarketValue,
      diff,
      pct: prevMarketValue === 0 ? 0 : (diff / prevMarketValue) * 100,
    };
  }

  return {
    holdingMap,
    totalDiff,
    totalPct:
      totalPrevMarketValue === 0 ? 0 : (totalDiff / totalPrevMarketValue) * 100,
  };
};

export interface HoldingDailyProfit {
  currentMarketValue: number;
  prevMarketValue: number;
  diff: number;
  pct: number;
}

export interface PortfolioDailyProfit {
  holdingMap: Record<string, HoldingDailyProfit>;
  totalDiff: number;
  totalPct: number;
}
