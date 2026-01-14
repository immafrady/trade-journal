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

export type TradeRecordStoreState = {
  store: Record<string, TradeRecordData>;
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
  create<TradeRecordStoreState>((set) => ({
    store: {},
    updateStore: (id: string, records: TradeRecord[]) =>
      set((state) => ({
        store: {
          ...state.store,
          [id]: genTradeRecordData(records),
        },
      })),
  }));

// 通用方法
export const useTradeRecordStore = <T>(
  selector: (state: TradeRecordStoreState) => T,
) => {
  const store = React.useContext(TradeRecordContext);
  return store?.(selector);
};
// 从store拿具体数据
export const useTradeRecordDataById = (holdingId: string) => {
  return (
    useTradeRecordStore((s) => s.store[holdingId]) ?? genTradeRecordData([])
  );
};
