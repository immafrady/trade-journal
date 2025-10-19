import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";

export const useTradeRecordSummary = (holdingId: string) => {
  const list = useTradeRecordList(holdingId);
  // 汇总操作次数、金额合计
};
