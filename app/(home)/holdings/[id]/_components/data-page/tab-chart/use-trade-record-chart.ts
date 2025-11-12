import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";

export interface TradeRecordChart {
  tradedAt: string;
  price: number;
  shares: number;
}

export const useTradeRecordChart = (holdingId: string) => {
  const { data: list = [] } = useTradeRecordList(holdingId);
  return React.useMemo(() => {
    return [...list]
      .map(
        (r) =>
          ({
            tradedAt: r.display.tradedAt,
            price: r.cumulative.costPrice,
            shares: r.cumulative.totalShares,
          }) satisfies TradeRecordChart,
      )
      .reverse();
  }, [list]);
};
