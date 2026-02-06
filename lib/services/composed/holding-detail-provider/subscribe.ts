import React from "react";
import {
  HoldingDetail,
  HoldingDetailContext,
  HoldingDetailState,
} from "@/lib/services/composed/holding-detail-provider";
import { useShallow } from "zustand/react/shallow";

// 基础的
export const useHoldingDetailStore = <T>(
  selector: (state: HoldingDetailState) => T,
) => {
  const store = React.useContext(HoldingDetailContext)!;
  return store(selector);
};

// 数据拼凑(列表）
export const useHoldingDetailList = (holdingIds: string[]): HoldingDetail[] => {
  return useHoldingDetailStore(
    useShallow((s) =>
      holdingIds.map((id) => ({
        id,
        record: s.recordStore[id],
        summary: s.summaryStore[id],
        latest: s.latestRecordStore[id],
        profit: s.profitStore[id],
        quote: s.quoteStore[id],
      })),
    ),
  );
};

// 数据拼凑(单个)
export const useHoldingDetailById = (id: string): HoldingDetail => {
  return useHoldingDetailStore(
    useShallow((s) => ({
      id,
      record: s.recordStore[id],
      summary: s.summaryStore[id],
      latest: s.latestRecordStore[id],
      profit: s.profitStore[id],
      quote: s.quoteStore[id],
    })),
  );
};

// 纯取TradeRecords
export const useTradeRecordsById = (holdingId: string) => {
  return useHoldingDetailStore((s) => s.recordStore[holdingId]);
};
