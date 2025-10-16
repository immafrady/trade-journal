import { TradeRecord } from "@/lib/services/trade-records/trade-record";

export const addTradeRecords = async (records: TradeRecord[]) => {
  return fetch("/api/actions/trade-records/add", {
    method: "POST",
    body: JSON.stringify(records),
  });
};
