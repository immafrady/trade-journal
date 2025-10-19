import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";

export const useTradeRecordExtendList = (holdingId: string) => {
  const list = useTradeRecordList(holdingId);
  // todo 计算累计金额变化、手续费合计
};
