import { useTradeRecordDataById } from "@/lib/services/trade-records";
import React from "react";

export interface TradeRecordChart {
  tradedAt: string;
  price: number;
  shares: number;
}

export const useTradeRecordChart = (holdingId: string) => {
  const { records } = useTradeRecordDataById(holdingId);
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
