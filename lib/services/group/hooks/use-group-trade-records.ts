import { TradeRecord, useTradeRecordStore } from "@/lib/services/trade-records";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import React from "react";
import { TradeRecordExtend } from "@/lib/services/group/domain/trade-record-extend";

export const useGroupTradeRecords = (holdingIds: string[]) => {
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

  return React.useMemo(() => {
    const result: TradeRecordExtend[] = [];
    const holdingState = new Map<string, ReturnType<typeof getStateInfo>>();

    // 👇 1️⃣ 先把所有记录摊平成时间线
    const timeline: TradeRecordExtend[] = [];
    for (const [id, records] of Object.entries(holdingRecordMap)) {
      const ticker = tickerMap.get(id)!;
      for (const record of records) {
        timeline.push(new TradeRecordExtend(id, ticker, record));
      }
    }

    // 👇 2️⃣ 按时间从旧到新排序
    timeline.sort(
      (a, b) =>
        a.record.props.tradedAt.valueOf() - b.record.props.tradedAt.valueOf(),
    );

    let totalAmount = 0;
    let totalMarketValue = 0;
    // 👇 3️⃣ 沿时间轴推进（核心算法 O(n)）
    for (const tre of timeline) {
      const prev = holdingState.get(tre.holdingId) ?? getStateInfo();
      // 先扣旧值
      totalAmount -= prev.totalAmount;
      totalMarketValue -= prev.totalMarketValue;
      // 存新状态
      holdingState.set(
        tre.holdingId,
        getStateInfo(
          tre.record.cumulative.totalAmount,
          tre.record.cumulative.totalMarketValue,
        ),
      );
      // 加回组合
      totalAmount += tre.record.cumulative.totalAmount;
      totalMarketValue += tre.record.cumulative.totalMarketValue;
      const valueIndex = totalAmount === 0 ? 0 : totalMarketValue / totalAmount;

      tre.group = {
        totalAmount,
        totalMarketValue,
        valueIndex,
      };
      result.unshift(tre);
    }
    return result;
  }, [tickerMap, holdingRecordMap]);
};

function getStateInfo(totalAmount = 0, totalMarketValue = 0) {
  return {
    totalAmount,
    totalMarketValue,
  };
}
