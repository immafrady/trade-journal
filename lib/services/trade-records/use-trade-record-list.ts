import useSWR, { SWRResponse } from "swr";
import {
  TradeRecord,
  TradeRecordModel,
} from "@/lib/services/trade-records/trade-record";

export function useTradeRecordList(
  holdingId: string,
): SWRResponse<TradeRecord[]> {
  return useSWR(
    `/api/actions/trade-records?holdingId=${holdingId}`,
    async (api) => {
      const response = await fetch(api);
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
