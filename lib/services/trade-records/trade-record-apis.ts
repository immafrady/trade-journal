import { TradeRecord } from "@/lib/services/trade-records/trade-record";

// 新增记录
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

// 删除指定记录
export const deleteSelectedTradeRecord = async (ids: string[]) => {
  return fetch(`/api/actions/trade-records`, {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};

// 编辑记录
export const updateTradeRecord = async (id: string, record: TradeRecord) => {
  return fetch(`/api/actions/trade-records/${id}`, {
    method: "PUT",
    body: JSON.stringify(record),
  });
};
