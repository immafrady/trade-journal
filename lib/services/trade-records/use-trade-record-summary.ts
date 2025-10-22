import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";

export const useTradeRecordSummary = (holdingId: string) => {
  const { data: list = [] } = useTradeRecordList(holdingId);
  // 汇总操作次数、金额合计
  let totalFee = 0;
  let totalAmount = 0;
  let totalShares = 0;
  for (const record of list) {
    totalFee += record.adjusted.fee;
    totalAmount += record.adjusted.amount;
    totalShares += record.adjusted.shares;
  }
  return {
    totalFee,
    totalAmount,
    totalShares,
    costPrice: totalAmount / totalShares,
    count: list.length,
  } as TradeRecordSummary;
};

export interface TradeRecordSummary {
  totalFee: number; // 总交易费用
  totalAmount: number; // 总支出金额
  totalShares: number; // 总份额
  costPrice: number; // 当前成本
  count: number;
}
