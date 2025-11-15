import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";
import { formatShares, StockValueFormatter } from "@/lib/market-utils";

export interface TradeRecordChart {
  tradedAt: string;
  price: string;
  shares: string;
}

export const useTradeRecordChart = (
  holdingId: string,
  formatter?: StockValueFormatter,
) => {
  const { data: list = [] } = useTradeRecordList(holdingId);
  return React.useMemo(() => {
    return [...list]
      .map(
        (r) =>
          ({
            tradedAt: r.display.tradedAt,
            price: formatter
              ? formatter(r.cumulative.costPrice)
              : r.cumulative.costPrice + "",
            shares: formatShares(r.cumulative.totalShares),
          }) satisfies TradeRecordChart,
      )
      .reverse();
  }, [list, formatter]);
};
