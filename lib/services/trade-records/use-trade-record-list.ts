import useSWR, { SWRResponse } from "swr";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import React from "react";

export function useTradeRecordList(
  holdingId: string,
): SWRResponse<TradeRecord[]> {
  const { data: list = [], ...swr } = useSWR(
    holdingId ? `/api/actions/trade-records?holdingId=${holdingId}` : null,
    async (api) => {
      const response = await fetch(api);
      const { data } = await response.json();
      return data;
    },
    {
      fallbackData: [],
    },
  );

  const data = React.useMemo(() => {
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
        costPrice: totalShares > 0 ? totalAmount / totalShares : 0,
      };
      result.unshift(record);
    }
    return result;
  }, [list]);

  return { ...swr, data };
}
