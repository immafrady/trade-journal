import React from "react";
import { useTradeRecordsById } from "@/lib/services/composed/holding-detail-provider";

export interface TradeRecordChart {
  tradedAt: string;
  price: number;
  shares: number;
}

export const useTradeRecordChart = (holdingId: string) => {
  const records = useTradeRecordsById(holdingId);
  return React.useMemo(() => {
    return [...records]
      .map(
        (r) =>
          ({
            tradedAt: r.display.tradedAt,
            price: r.cumulative.costPrice,
            shares: r.cumulative.totalShares,
          }) satisfies TradeRecordChart,
      )
      .reverse();
  }, [records]);
};
