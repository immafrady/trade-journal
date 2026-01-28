import { TradeRecord, useTradeRecordStore } from "@/lib/services/trade-records";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import React from "react";
import { TradeRecordExtend } from "@/lib/services/group/domain/trade-record-extend";

export const useGroupTradeRecords = (holdingIds: string[]) => {
  const { data: holdingList } = useHoldingList();
  const tickerMap = React.useMemo(() => {
    return new Map(holdingList.map((holding) => [holding.id, holding.ticker]));
  }, [holdingList]);
  const holdingRecordMap = useTradeRecordStore((s) => {
    const result: Record<string, TradeRecord[]> = {};
    for (const id of holdingIds) {
      if (s.store[id]) result[id] = s.store[id].records;
    }
    return result;
  });
  const tres = React.useMemo(() => {
    const result: TradeRecordExtend[] = [];

    for (const [id, records] of Object.entries(holdingRecordMap)) {
      const ticker = tickerMap.get(id)!;
      for (const record of records) {
        result.push(new TradeRecordExtend(id, ticker, record));
      }
    }

    result.sort(
      (a, b) =>
        a.record.props.tradedAt.valueOf() - b.record.props.tradedAt.valueOf(),
    );

    return result;
  }, [tickerMap, holdingRecordMap]);
  // 基础数据处理end
  const latestRecordMap = new Map<string, TradeRecordExtend>();
  // 中间变量end

  const finalRecords: TradeRecordExtend[] = [];
  for (const tre of tres) {
    latestRecordMap.set(tre.holdingId, tre);
    for (const [, latestTre] of latestRecordMap) {
      tre.group.totalAmount += latestTre.record.cumulative.totalAmount;
      tre.group.totalMarketValue +=
        latestTre.record.cumulative.totalMarketValue;
    }
    tre.group.totalMarketValue =
      tre.group.totalMarketValue / tre.group.totalAmount;

    finalRecords.unshift(tre);
  }
  return finalRecords;
};
