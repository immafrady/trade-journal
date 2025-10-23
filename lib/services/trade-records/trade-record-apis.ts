import { TradeRecord } from "@/lib/services/trade-records/trade-record";

export const addTradeRecords = async (records: TradeRecord[]) => {
  return fetch("/api/actions/trade-records/add", {
    method: "POST",
    body: JSON.stringify(records),
  });
};

// 清除所有记录
export const clearAllTradeRecords = async (holdingId: string) => {
  return fetch(`/api/actions/holdings/${holdingId}/clear-records`, {
    method: "DELETE",
  });
};
