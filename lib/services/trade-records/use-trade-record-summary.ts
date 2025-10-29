import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";

export const useTradeRecordSummary = (holdingId: string) => {
  const { data: list = [] } = useTradeRecordList(holdingId);
  // 汇总操作次数、金额合计
  let totalFee = 0;
  let totalAmount = 0;
  let costPrice = 0;
  let maxTotalAmount = 0;
  let totalShares = 0;
  let maxTotalShares = 0;
  let maxTotalAmountTradedAt: string | null = null;
  let maxTotalSharesTradedAt: string | null = null;
  if (list.length) {
    totalAmount = list[0].cumulative.totalAmount;
    totalShares = list[0].cumulative.totalShares;
    costPrice = list[0].cumulative.costPrice;
    for (let i = list.length - 1; i >= 0; i--) {
      const record = list[i];
      totalFee += record.adjusted.fee;
      maxTotalAmount = Math.max(totalAmount, record.cumulative.totalAmount);
      if (maxTotalAmount === record.cumulative.totalAmount) {
        maxTotalAmountTradedAt = record.display.tradedAt;
      }
      maxTotalShares = Math.max(totalShares, record.cumulative.totalShares);
      if (maxTotalShares === record.cumulative.totalShares) {
        maxTotalSharesTradedAt = record.display.tradedAt;
      }
    }
  }

  return {
    totalFee,
    totalAmount,
    totalShares,
    costPrice,
    count: list.length,
    maxTotalAmount,
    maxTotalShares,
    totalAmountPct: totalAmount / maxTotalAmount,
    totalSharesPct: totalShares / maxTotalShares,
    maxTotalAmountTradedAt,
    maxTotalSharesTradedAt,
  } as TradeRecordSummary;
};

export interface TradeRecordSummary {
  totalFee: number; // 总交易费用
  totalAmount: number; // 总支出金额
  totalShares: number; // 总份额
  costPrice: number; // 当前成本
  count: number; // 操作次数
  maxTotalAmount: number; // 最高时的总交易费用
  maxTotalShares: number; // 最高时的总份额
  totalAmountPct: number; // 总交易费用百分位
  maxTotalAmountTradedAt?: string; // 最高时的总交易费用发生日期
  totalSharesPct: number; // 总份额百分位
  maxTotalSharesTradedAt?: string; // 最高时的总份额发生日期
}
