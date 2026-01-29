import { TradeRecord, useTradeRecordStore } from "@/lib/services/trade-records";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import React from "react";

export const useGroupHoldings = (holdingIds: string[]) => {
  const store = useTradeRecordStore((s) => s.store);
  const { data: holdingList } = useHoldingList();
  const tickerMap = React.useMemo(() => {
    return new Map(holdingList.map((holding) => [holding.id, holding.ticker]));
  }, [holdingList]);
  const holdingRecordMap = React.useMemo(() => {
    const result: Record<string, TradeRecord[]> = {};
    for (const id of holdingIds) {
      if (store[id]) result[id] = store[id].records;
    }
    return result;
  }, [holdingIds, store]);

  return {
    tickerMap,
    holdingRecordMap,
  };
};
