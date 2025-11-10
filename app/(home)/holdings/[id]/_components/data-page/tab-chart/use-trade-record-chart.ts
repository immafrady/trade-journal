import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";

export const useTradeRecordChart = (holdingId: string) => {
  const { data: list = [] } = useTradeRecordList(holdingId);
};
