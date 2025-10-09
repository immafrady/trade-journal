import useSWR, { SWRResponse } from "swr";
import {
  TradeRecord,
  TradeRecordModel,
} from "@/lib/services/trade-records/trade-record";

export function useTradeRecordList(
  holdingId: string,
): SWRResponse<TradeRecord[]> {
  return useSWR(
    holdingId + "",
    async (holdingId) => {
      const response = await fetch(
        `/api/actions/trade-records?holdingId=${holdingId}`,
      );
      const { data } = await response.json();
      return data.map((model: TradeRecordModel) =>
        TradeRecord.fromDatabase(model),
      );
    },
    {
      fallbackData: [],
    },
  );
}
