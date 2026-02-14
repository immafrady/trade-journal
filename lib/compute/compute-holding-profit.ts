// 计算市值

import { HoldingSummary } from "@/lib/compute/compute-holding-summary";

export const computeHoldingProfit = (
  price: number,
  summary?: HoldingSummary,
) => {
  const shares = summary?.shares ?? 0;
  const remainingCost = summary?.remainingCost ?? 0;
  const realizedProfit = summary?.realizedProfit ?? 0;
  const historicalMaxCapitalOccupied =
    summary?.historicalMaxCapitalOccupied ?? 0;
  const isRecovered = summary?.isRecovered ?? false;

  const marketValue = price * shares;
  const unrealizedProfit = shares > 0 ? marketValue - remainingCost : 0;
  const totalProfit = realizedProfit + unrealizedProfit;

  return {
    shares, // 持仓份额
    marketValue, // 市值
    /** 收益结果（核心） */
    unrealizedProfit, // 当前浮动盈亏（市值 - 当前持仓成本）
    totalProfit, // 总盈亏 = realized + unrealized + 分红 - 手续费
    /** 收益率（只在合理时显示） */
    totalReturnPct:
      historicalMaxCapitalOccupied > 0
        ? (totalProfit / historicalMaxCapitalOccupied) * 100
        : 0, // 总收益率（基于历史最大净投入）
    holdingReturnPct:
      !isRecovered && remainingCost > 0
        ? (unrealizedProfit / remainingCost) * 100
        : 0, // 持仓收益率（仅当未回本时显示）
  };
};

export type HoldingProfit = ReturnType<typeof computeHoldingProfit>;
