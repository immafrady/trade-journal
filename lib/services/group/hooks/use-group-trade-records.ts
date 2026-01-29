import React from "react";
import { TradeRecordExtend } from "@/lib/services/group/domain/trade-record-extend";
import { useGroupHoldings } from "@/lib/services/group/hooks/use-group-holdings";

export const useGroupTradeRecords = (holdingIds: string[]) => {
  const { tickerMap, holdingRecordMap } = useGroupHoldings(holdingIds);

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
    let marketValue = 0;
    // 👇 3️⃣ 沿时间轴推进（核心算法 O(n)）
    for (const tre of timeline) {
      const prev = holdingState.get(tre.holdingId) ?? getStateInfo();
      // 先扣旧值
      totalAmount -= prev.totalAmount;
      marketValue -= prev.marketValue;
      // 存新状态
      holdingState.set(
        tre.holdingId,
        getStateInfo(
          tre.record.cumulative.totalAmount,
          tre.record.cumulative.marketValue,
        ),
      );
      // 加回组合
      totalAmount += tre.record.cumulative.totalAmount;
      marketValue += tre.record.cumulative.marketValue;
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

function getStateInfo(totalAmount = 0, marketValue = 0) {
  return {
    totalAmount,
    marketValue,
  };
}
