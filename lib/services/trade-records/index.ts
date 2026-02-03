export { TradeRecordConstants } from "./domain/constants";
export { TradeRecord } from "./domain/trade-record";
export type {
  TradeRecordCSVModel,
  TradeRecordModel,
} from "./domain/trade-record";
export {
  TradeRecordType,
  TradeRecordTypeValue,
} from "./domain/trade-record-type";

export { parseFromCsv } from "./utils/parse-from-csv";
export {
  computeHoldingSummary,
  type HoldingSummary,
} from "./utils/compute-holding-summary";
export {
  computeHoldingProfit,
  type HoldingProfit,
} from "./utils/compute-holding-profit";

export {
  addTradeRecords,
  updateTradeRecord,
  clearAllTradeRecords,
  deleteSelectedTradeRecord,
} from "./trade-record-apis";

export {
  TradeRecordProvider,
  TradeRecordContext,
  TradeRecordUpdaterContext,
} from "./provider/trade-record-provider";
export {
  TradeRecordUpdater,
  type TradeRecordUpdaterHandle,
} from "./provider/trade-record-provider/trade-record-updater";
export {
  useTradeRecordDataById,
  createTradeRecordStore,
  useTradeRecordStore,
} from "./provider/trade-record-provider/trade-record-store";
export type {
  TradeRecordData,
  TradeRecordStore,
  TradeRecordStoreState,
  TradeRecordDraft,
} from "./provider/trade-record-provider/trade-record-store";
