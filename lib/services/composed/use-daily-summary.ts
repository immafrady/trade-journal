import { TradeRecordExtend, useGroupTradeRecords } from "@/lib/services/group";
import { Dayjs } from "dayjs";
import React from "react";

// 计算每一天
export const useDailySummary = (holdingIds: string[]) => {
  const list = useGroupTradeRecords(holdingIds);
  const ascList = React.useMemo(() => [...list].reverse(), [list]);

  return React.useMemo(() => {
    // 如果你的 list 是按时间倒序，这里可以先 reverse 一次
    return buildDailySummary(ascList, holdingIds).reverse();
  }, [ascList, holdingIds]);
};

export function buildDailySummary(
  list: TradeRecordExtend[],
  holdingIds: string[],
): DailySummary[] {
  if (list.length === 0) return [];

  const result: DailySummary[] = [];

  let currentDate: Dayjs | null = null;
  let prevShares: Record<string, number> = {};
  let currentShares: Record<string, number> = Object.fromEntries(
    holdingIds.map((id) => [id, 0]),
  );
  let records: TradeRecordExtend[] = [];

  for (const tre of list) {
    const d = tre.record.props.tradedAt;

    // 🔁 日期变化 → 结算上一天
    if (currentDate && !d.isSame(currentDate)) {
      result.push({
        date: currentDate,
        prevShares,
        currentShares,
        records,
      });

      // 新一天开始：昨日收盘 = 昨天的 current
      prevShares = currentShares;
      currentShares = { ...currentShares }; // 新对象，防止污染
      records = [];
    }

    // 🆕 第一次 or 新的一天
    if (!currentDate || !d.isSame(currentDate)) {
      currentDate = d;
    }

    // 📈 更新当日数据
    currentShares[tre.holdingId] = tre.record.cumulative.totalShares;
    records = [...records, tre]; // 不原地 push，保持不可变思维
  }

  // 🧾 收尾：最后一天
  if (currentDate) {
    result.push({
      date: currentDate,
      prevShares,
      currentShares,
      records,
    });
  }

  return result;
}

export interface DailySummary {
  date: Dayjs;
  prevShares: Record<string, number>;
  currentShares: Record<string, number>;
  records: TradeRecordExtend[];
}
