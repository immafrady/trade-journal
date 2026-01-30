import React from "react";
import { TradeRecordExtend } from "@/lib/services/group/domain/trade-record-extend";
import { useGroupHoldings } from "@/lib/services/group/hooks/use-group-holdings";

export const useGroupTradeRecords = (holdingIds: string[]) => {
  const { tickerMap, holdingRecordMap } = useGroupHoldings(holdingIds);

  return React.useMemo(() => {
    const result: TradeRecordExtend[] = [];
    const marketValueMap = new Map<string, number>();

    // 👇 1️⃣ 先把所有记录摊平成时间线
    const timeline: TradeRecordExtend[] = [];
    for (const [id, records] of Object.entries(holdingRecordMap)) {
      const ticker = tickerMap.get(id)!;
      for (const record of records) {
        timeline.push(new TradeRecordExtend(id, ticker, record));
      }
    }

    // 👇 2️⃣ 按时间从旧到新排序，其次按照id从旧到新排序
    timeline.sort((a, b) => {
      const timeDiff =
        a.record.props.tradedAt.valueOf() - b.record.props.tradedAt.valueOf();
      if (!timeDiff) return timeDiff;
      return a.record.props.id! - b.record.props.id!;
    });

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
      result.unshift(tre);
    }
    return result;
  }, [tickerMap, holdingRecordMap]);
};
