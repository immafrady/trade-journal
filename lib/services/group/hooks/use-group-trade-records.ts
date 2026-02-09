import React from "react";
import { TradeRecordExtend } from "@/lib/services/group";
import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider";
import { useShallow } from "zustand/react/shallow";
import { useTickerMap } from "@/lib/services/holdings/use-ticker-map";

export const useGroupTradeRecords = (holdingIds: string[]) => {
  const tickerMap = useTickerMap();
  const recordList = useHoldingDetailStore(
    useShallow((s) => holdingIds.map((id) => s.recordStore[id])),
  );

  return React.useMemo(() => {
    const result: TradeRecordExtend[] = [];
    const marketValueMap = new Map<string, number>();

    // 👇 1️⃣ 先把所有记录摊平成时间线
    const timeline: TradeRecordExtend[] = [];
    for (let i = 0; i < holdingIds.length; i += 1) {
      const id = holdingIds[i];
      const records = recordList[i];
      const ticker = tickerMap[id];
      for (const record of records) {
        timeline.push(new TradeRecordExtend(id, ticker, record));
      }
    }

    // 👇 2️⃣ 按时间从旧到新排序，其次按照id从旧到新排序
    timeline.sort(
      (a, b) =>
        a.record.props.tradedAt.valueOf() - b.record.props.tradedAt.valueOf() ||
        a.record.props.id! - b.record.props.id!,
    );

    let totalAmount = 0;
    // 👇 3️⃣ 沿时间轴推进（核心算法 O(n)）
    for (const tre of timeline) {
      totalAmount += tre.record.adjusted.amount;
      marketValueMap.set(tre.holdingId, tre.record.cumulative.marketValue);
      const marketValue = marketValueMap
        .values()
        .reduce((prev, curr) => prev + curr, 0);

      const valueIndex = totalAmount === 0 ? 0 : marketValue / totalAmount;

      tre.group = {
        totalAmount,
        marketValue,
        valueIndex,
      };
      result.push(tre);
    }
    return result.reverse();
  }, [holdingIds, recordList, tickerMap]);
};
