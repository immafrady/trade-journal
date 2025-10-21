import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";

export const useTradeRecordExtendList = (holdingId: string) => {
  const { data: list } = useTradeRecordList(holdingId);
  if (list?.length) {
    let totalShares = 0;
    let totalAmount = 0;
    const result: TradeRecordExtend[] = [];
    for (let i = list.length - 1; i >= 0; i--) {
      const record = list[i];
      totalShares += record.adjusted.shares;
      totalAmount += record.adjusted.amount;
      result.unshift({
        record,
        totalShares,
        totalAmount,
      });
    }
    return result;
  } else {
    return [];
  }
};

export interface TradeRecordExtend {
  record: TradeRecord;
  totalShares: number;
  totalAmount: number;
}
