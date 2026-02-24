// 实际计算方法
import { TradeRecord, TradeRecordType } from "@/lib/services/trade-records";

export const computeHoldingSummary = (records: TradeRecord[]) => {
  records = records
    .filter((record) => TradeRecordType.Draft !== record.props.type) // 过滤掉草稿
    .reverse(); // 翻转
  // 汇总操作次数、金额合计
  let shares = 0;
  let remainingCost = 0; // 当前持仓真实成本
  let netInvestment = 0; // 净投入资金

  let totalBuyAmount = 0;
  let totalSellAmount = 0;
  let totalDividend = 0;
  let totalFee = 0;

  let totalBuyCount = 0;
  let totalSellCount = 0;
  let totalDividendCount = 0;

  let realizedProfit = 0;
  let historicalMaxCapitalOccupied = 0;

  for (const record of records) {
    if (
      [TradeRecordType.Merge, TradeRecordType.Split].includes(record.props.type)
    ) {
      // 🧩 拆股 / 合股（只影响份额和成本单价，不影响总成本）
      shares += record.adjusted.shares;
    } else if (TradeRecordType.Dividend === record.props.type) {
      // 💰 现金分红
      totalDividend -= record.adjusted.amount; // amount 是负数（现金流入）
      totalDividendCount++;
      realizedProfit -= record.adjusted.amount;
      netInvestment += record.adjusted.amount; // amount负数 → 净投入减少
    } else if (TradeRecordType.Draft !== record.props.type) {
      // 📈 普通交易（申购/赎回/买卖）
      totalFee += record.adjusted.fee;

      const tradeShares = record.adjusted.shares;
      const tradeAmount = record.adjusted.amount;

      if (tradeShares > 0) {
        // ===== 买入 / 申购 =====
        shares += tradeShares;
        remainingCost += tradeAmount; // 买入增加成本
        netInvestment += tradeAmount;
        totalBuyAmount += tradeAmount;
        totalBuyCount++;
      } else if (tradeShares < 0) {
        // ===== 卖出 / 赎回 =====
        const avgCost = shares > 0 ? remainingCost / shares : 0;
        const costPortion = avgCost * -tradeShares;

        shares += tradeShares;
        remainingCost -= costPortion;

        realizedProfit += -tradeAmount - costPortion;
        netInvestment += tradeAmount;

        totalSellAmount -= tradeAmount;
        totalSellCount++;
      }

      historicalMaxCapitalOccupied = Math.max(
        historicalMaxCapitalOccupied,
        netInvestment,
      );
    }
  }

  return {
    /** 当前状态 */
    shares, // 当前持仓份额
    /** 资金流向 */
    totalBuyAmount, // 累计买入金额
    totalSellAmount, // 累计卖出回收金额
    totalFee, // 累计手续费（仅做统计处理）
    totalDividend, // 累计分红
    totalBuyCount, // 累计买入次数
    totalSellCount, // 累计卖出次数
    totalDividendCount, // 累计分红次数
    /** 成本与回本状态 */
    netInvestment, // 净投入资金 = 买入 - 卖出 + 手续费 - 分红
    costPrice: shares > 0 && remainingCost > 0 ? remainingCost / shares : 0, // 当前持仓成本价（仅当 shares > 0 且 netInvestment > 0 有意义）
    avgPrice: shares > 0 ? netInvestment / shares : 0, // 总和成本
    remainingCost, // 当前持仓真实成本
    /** 收益结果（核心） */
    realizedProfit, // 已实现盈亏（卖出部分）
    /** 杂项*/
    historicalMaxCapitalOccupied, // 最高资金占用
  };
};

export type HoldingSummary = ReturnType<typeof computeHoldingSummary>;
