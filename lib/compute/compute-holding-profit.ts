// 计算市值

import { HoldingSummary } from "@/lib/compute/compute-holding-summary";

export const computeHoldingProfit = (
  price: number,
  summary?: HoldingSummary,
) => {
  const shares = summary?.shares ?? 0;
  const remainingCost = summary?.remainingCost ?? 0;
  const realizedProfit = summary?.realizedProfit ?? 0;
  const netInvestment = summary?.netInvestment ?? 0;
  const isRecovered = netInvestment <= 0;

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
    totalReturnPct: !isRecovered ? (totalProfit / netInvestment) * 100 : 0, // 总收益率（基于历史净投入）
    holdingReturnPct: (unrealizedProfit / remainingCost) * 100, // 持仓收益率（仅当未回本时显示）
    isRecovered, // 是否已回本（净投入 <= 0）
  };
};

export type HoldingProfit = ReturnType<typeof computeHoldingProfit>;
