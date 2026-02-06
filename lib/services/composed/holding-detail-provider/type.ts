import {
  HoldingProfit,
  HoldingSummary,
  TradeRecord,
} from "@/lib/services/trade-records";
import type { UseBoundStore } from "zustand/react";
import { StoreApi } from "zustand/vanilla";
import { SinaQuote } from "@/lib/services/sina";

// 草稿
export interface TradeRecordDraft {
  holdingId: string;
  records: TradeRecord[];
}

// 状态
export type HoldingDetailState = {
  recordStore: Record<string, TradeRecord[]>;
  summaryStore: Record<string, HoldingSummary>;
  latestRecordStore: Record<string, TradeRecord>;
  profitStore: Record<string, HoldingProfit>;
  quoteStore: Record<string, SinaQuote>;
  draftList: TradeRecordDraft[];
  updateStore: (id: string, list: TradeRecord[]) => void;
  updateQuotes: (quoteMap: Record<string, SinaQuote>) => void;
  updateDraftList: () => void;
  updateProfit: (id: string) => void;
  updateProfits: () => void;
};

// 仓库
export type HoldingDetailStore = UseBoundStore<StoreApi<HoldingDetailState>>;

// HoldingDetail
export interface HoldingDetail {
  id: string;
  record?: TradeRecord[];
  summary?: HoldingSummary;
  latest?: TradeRecord;
  profit?: HoldingProfit;
  quote?: SinaQuote;
}
