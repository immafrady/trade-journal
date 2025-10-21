import { useTradeRecordExtendList } from "@/lib/services/trade-records/use-trade-record-extend-list";

export const useTradeRecordSummary = (holdingId: string) => {
  const list = useTradeRecordExtendList(holdingId);
  // 汇总操作次数、金额合计
  let totalFee = 0;
  for (const item of list) {
    totalFee += item.record.adjusted.fee;
  }
  return {
    totalFee,
  } as TradeRecordSummary;
};

export interface TradeRecordSummary {
  totalFee: number;
}
