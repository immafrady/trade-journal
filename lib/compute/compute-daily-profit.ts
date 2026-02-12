import { DailySummary } from "@/lib/services/composed/use-daily-summary";
import { SinaQuote } from "@/lib/services/sina";
import { TradeRecordType } from "@/lib/services/trade-records";

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

    /**
     * todo 持续观察计算合理性
     * 计算方法：
     * 当下=不变仓位*现价 + Σ(买入量*现价)   + Σ(买出量*卖出价)
     * 之前=不变仓位*昨收 + Σ(买入量*买入价) + Σ(买出量*昨收)
     * diff=当下-之前
     * pct=diff/之前
     */
    const currentShares = dailySummary.currentShares[holdingId] ?? 0;
    const isSameDate = summaryDateStr === quote.date;
    const prevShares = isSameDate
      ? (dailySummary.prevShares[holdingId] ?? 0)
      : currentShares; // 非同一日的交易，不用特殊计算直接期初期末份额一致
    let currentMarketValue = currentShares * quote.current!;
    let prevMarketValue = prevShares * quote.prevClose!;

    if (isSameDate) {
      for (const tre of dailySummary.records) {
        if (tre.holdingId === holdingId) {
          switch (tre.record.props.type) {
            case TradeRecordType.Sell:
            case TradeRecordType.Redeem: {
              // prevMarketValue已包含，不做重复计算
              currentMarketValue += -tre.record.adjusted.amount;
              break;
            }
            case TradeRecordType.Buy:
            case TradeRecordType.Subscribe: {
              // currentMarketValue已包含，不做重复计算
              prevMarketValue += tre.record.adjusted.amount;
              break;
            }
            case TradeRecordType.Dividend: {
              // 分红在现价里面已经体现，所以必须要在昨收的部分减掉对应的金额
              prevMarketValue += tre.record.adjusted.amount;
              break;
            }
          }
        }
      }
    }

    const diff = currentMarketValue - prevMarketValue;
    totalDiff += diff;
    totalPrevMarketValue += prevMarketValue;

    holdingMap[holdingId] = {
      currentMarketValue,
      prevMarketValue,
      diff,
      pct: prevMarketValue === 0 ? 0 : (diff / prevMarketValue) * 100,
      current: quote.current!,
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
  current: number;
}

export interface PortfolioDailyProfit {
  holdingMap: Record<string, HoldingDailyProfit>;
  totalDiff: number;
  totalPct: number;
}
