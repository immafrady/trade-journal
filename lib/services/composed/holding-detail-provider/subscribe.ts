import React from "react";
import {
  HoldingDetail,
  HoldingDetailContext,
  HoldingDetailState,
} from "@/lib/services/composed/holding-detail-provider";
import { useShallow } from "zustand/react/shallow";

export const EMPTY_ARRAY: never[] = [];
// 基础的
export const useHoldingDetailStore = <T>(
  selector: (state: HoldingDetailState) => T,
) => {
  const store = React.useContext(HoldingDetailContext);
  if (!store)
    throw new Error(
      "HoldingDetailStore must be used with HoldingDetailProvider",
    );
  return store(selector);
};

// 数据拼凑(列表）
export const useHoldingDetailList = (holdingIds: string[]): HoldingDetail[] => {
  // 1. Selector 只负责从 Store 中获取相关的原始引用
  // 即使 store 里的数据变了，只要这几个 store 本身的引用没变，就不会触发重绘
  const stores = useHoldingDetailStore(
    useShallow((s) => ({
      recordStore: s.recordStore,
      summaryStore: s.summaryStore,
      latestRecordStore: s.latestRecordStore,
      profitStore: s.profitStore,
      quoteStore: s.quoteStore,
    })),
  );

  // 2. 在外部使用 useMemo 组装数据
  // 只有当 holdingIds 或 具体的 store 变化时，才会重新构造对象
  return React.useMemo(() => {
    return holdingIds.map((id) => ({
      id,
      record: stores.recordStore[id] ?? EMPTY_ARRAY,
      summary: stores.summaryStore[id],
      latest: stores.latestRecordStore[id],
      profit: stores.profitStore[id],
      quote: stores.quoteStore[id],
    }));
  }, [holdingIds, stores]);
};

// 数据拼凑(单个)
export const useHoldingDetailById = (id: string): HoldingDetail => {
  return useHoldingDetailStore(
    useShallow((s) => ({
      id,
      record: s.recordStore[id] ?? EMPTY_ARRAY,
      summary: s.summaryStore[id],
      latest: s.latestRecordStore[id],
      profit: s.profitStore[id],
      quote: s.quoteStore[id],
    })),
  );
};

// 纯取TradeRecords
export const useTradeRecordsById = (holdingId: string) => {
  return useHoldingDetailStore((s) => s.recordStore[holdingId] ?? EMPTY_ARRAY);
};

export const useHoldingSummaryById = (holdingId: string) => {
  return useHoldingDetailStore((s) => s.summaryStore[holdingId]);
};

export const useLatestTradeRecordById = (holdingId: string) => {
  return useHoldingDetailStore((s) => s.latestRecordStore[holdingId]);
};

export const useHoldingProfitById = (holdingId: string) => {
  return useHoldingDetailStore((s) => s.profitStore[holdingId]);
};

export const useHoldingQuoteById = (holdingId: string) => {
  return useHoldingDetailStore((s) => s.quoteStore[holdingId]);
};
