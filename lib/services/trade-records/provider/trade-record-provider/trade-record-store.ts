import { create, type UseBoundStore } from "zustand/react";
import {
  computeTradeRecordSummary,
  TradeRecord,
  TradeRecordContext,
  TradeRecordSummary,
} from "@/lib/services/trade-records";
import { StoreApi } from "zustand/vanilla";
import React from "react";

export interface TradeRecordData {
  records: TradeRecord[];
  summary: TradeRecordSummary;
}

export interface TradeRecordDraft {
  holdingId: string;
  records: TradeRecord[];
}

export type TradeRecordStoreState = {
  store: Record<string, TradeRecordData>;
  draftList: TradeRecordDraft[];
  updateStore: (id: string, list: TradeRecord[]) => void;
};

export type TradeRecordStore = UseBoundStore<StoreApi<TradeRecordStoreState>>;

// ------ //

const genTradeRecordData = (records: TradeRecord[]) => {
  return {
    records: records,
    summary: computeTradeRecordSummary(records),
  };
};

export const createTradeRecordStore = (): TradeRecordStore =>
  create<TradeRecordStoreState>((set, get) => ({
    store: {},
    // 待完成清单
    draftList: [],
    updateStore: (id: string, records: TradeRecord[]) =>
      set((state) => {
        const store = {
          ...state.store,
          [id]: genTradeRecordData(records),
        };
        const draftList: TradeRecordStoreState["draftList"] = [];
        Object.entries(store).forEach(([holdingId, data]) => {
          const drafts = data.records.filter((r) => r.meta.isDraft);
          if (drafts.length) {
            draftList.push({
              holdingId,
              records: drafts,
            });
          }
        });

        return {
          store,
          draftList,
        };
      }),
  }));

// 通用方法
export const useTradeRecordStore = <T>(
  selector: (state: TradeRecordStoreState) => T,
) => {
  const store = React.useContext(TradeRecordContext)!;
  return store(selector);
};
// 从store拿具体数据
export const useTradeRecordDataById = (holdingId: string) => {
  return (
    useTradeRecordStore((s) => s.store[holdingId]) ?? genTradeRecordData([])
  );
};
