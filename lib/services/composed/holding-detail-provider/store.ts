import {
  HoldingDetailState,
  HoldingDetailStore,
  TradeRecordDraft,
} from "@/lib/services/composed/holding-detail-provider/type";
import { create } from "zustand/react";
import { TradeRecord, TradeRecordType } from "@/lib/services/trade-records";
import { computeHoldingProfit, computeHoldingSummary } from "@/lib/compute";

export const createHoldingDetailStore = (): HoldingDetailStore =>
  create((set, get) => ({
    recordStore: {},
    summaryStore: {},
    profitStore: {},
    latestRecordStore: {},
    quoteStore: {},
    draftList: [],
    updateStore: (id: string, records: TradeRecord[]) => {
      set((state) => {
        const newState: Partial<HoldingDetailState> = {
          recordStore: {
            ...state.recordStore,
            [id]: records,
          },
          summaryStore: {
            ...state.summaryStore,
            [id]: computeHoldingSummary(records),
          },
        };
        const latest = records.find(
          (record) => TradeRecordType.Draft !== record.props.type,
        );
        if (latest) {
          newState.latestRecordStore = {
            ...state.latestRecordStore,
            [id]: latest,
          };
        }
        return newState;
      });
      // 更新
      get().updateProfit(id);
      get().updateDraftList();
    },
    // 更新草稿列表
    updateDraftList: () =>
      set((state) => {
        const draftList: TradeRecordDraft[] = [];
        Object.entries(state.recordStore).forEach(([holdingId, records]) => {
          const drafts = records.filter(
            (r) => r.meta.isDraft || TradeRecordType.Draft === r.props.type,
          );
          if (drafts.length) {
            draftList.push({
              holdingId,
              records: drafts,
            });
          }
        });
        return {
          draftList,
        };
      }),
    // 更新价格
    updateQuotes: (quoteMap) => {
      set((state) => {
        return {
          quoteStore: quoteMap,
        };
      });
      get().updateProfits();
    },
    updateProfit: (id: string) =>
      set((state) => {
        const summary = state.summaryStore[id];
        const quote = state.quoteStore[id];
        const latest = state.latestRecordStore[id];
        if (summary) {
          const price = quote?.current || latest?.derived.price;
          if (price) {
            return {
              profitStore: {
                ...state.profitStore,
                [id]: computeHoldingProfit(price, summary),
              },
            };
          }
        }
        return state;
      }),
    updateProfits: () => {
      const ids = Object.keys(get().recordStore);
      ids.forEach((id) => {
        get().updateProfit(id);
      });
    },
  }));
