import useSWR, { SWRResponse } from "swr";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";

export function useTradeRecordList(
  holdingId: string,
): SWRResponse<TradeRecord[]> {
  return useSWR(
    `/api/actions/trade-records?holdingId=${holdingId}`,
    async (api) => {
      const response = await fetch(api);
      const { data: list } = await response.json();
      let totalShares = 0;
      let totalAmount = 0;
      const result: TradeRecord[] = [];
      for (let i = list.length - 1; i >= 0; i--) {
        const record = TradeRecord.fromDatabase(list[i]);
        totalShares += record.adjusted.shares;
        totalAmount += record.adjusted.amount;
        record.cumulative = {
          totalAmount,
          totalShares,
        };
        result.unshift(record);
      }
      return result;
    },
    {
      fallbackData: [],
    },
  );
}
