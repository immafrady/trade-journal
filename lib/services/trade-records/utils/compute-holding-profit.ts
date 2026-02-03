// 计算市值
import { HoldingSummary } from "@/lib/services/trade-records";

export const computeHoldingProfit = (
  price: number,
  summary: HoldingSummary,
) => {
  const marketValue = price * summary.shares;
  const unrealizedProfit =
    summary.shares > 0 ? marketValue - summary.remainingCost : 0;
  const totalProfit = summary.realizedProfit + unrealizedProfit;

  return {
    marketValue, // 市值
    /** 收益结果（核心） */
    unrealizedProfit, // 当前浮动盈亏（市值 - 当前持仓成本）
    totalProfit, // 总盈亏 = realized + unrealized + 分红 - 手续费
    /** 收益率（只在合理时显示） */
    totalReturnPct:
      summary.historicalMaxCapitalOccupied > 0
        ? (totalProfit / summary.historicalMaxCapitalOccupied) * 100
        : 0, // 总收益率（基于历史最大净投入）
    holdingReturnPct:
      !summary.isRecovered && summary.remainingCost > 0
        ? (unrealizedProfit / summary.remainingCost) * 100
        : 0, // 持仓收益率（仅当未回本时显示）
  };
};

export type HoldingProfit = ReturnType<typeof computeHoldingProfit>;
