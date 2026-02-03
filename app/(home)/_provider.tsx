import React from "react";
import {
  HoldingWithQuote,
  useHoldingsWithQuote,
} from "@/lib/services/composed/use-holdings-with-quote";
import { useTradeRecordStore } from "@/lib/services/trade-records/provider/trade-record-provider/trade-record-store";
import {
  computeHoldingProfit,
  HoldingProfit,
  HoldingSummary,
} from "@/lib/services/trade-records";

interface HomeProviderProps {
  list: HoldingWithQuoteExtend[];
  totalMarketValue: number;
  totalProfit: number;
}

export const HomeContext = React.createContext<HomeProviderProps>({
  list: [],
  totalMarketValue: 0,
  totalProfit: 0,
});

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useTradeRecordStore((s) => s.store);
  const holdingWithQuotes = useHoldingsWithQuote();

  let totalMarketValue = 0;
  let totalProfit = 0;
  const list: HoldingWithQuoteExtend[] = [];
  for (const hwq of holdingWithQuotes) {
    const data = store[hwq.id];
    if (data) {
      const profit = hwq.quote
        ? computeHoldingProfit(hwq.quote.current!, data.summary)
        : data.latestProfit;
      totalMarketValue += profit?.marketValue ?? 0;
      totalProfit += profit?.totalProfit ?? 0;
      list.push({
        ...hwq,
        summary: data.summary,
        profit,
        proportion: 0,
      });
    }
  }

  return (
    <HomeContext.Provider
      value={{
        list: list
          .map((item) => ({
            ...item,
            proportion:
              ((item.profit?.marketValue ?? 0) / totalMarketValue) * 100,
          }))
          .sort((a, b) => b.proportion - a.proportion),
        totalMarketValue,
        totalProfit,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export interface HoldingWithQuoteExtend extends HoldingWithQuote {
  summary: HoldingSummary;
  profit?: HoldingProfit;
  proportion: number;
}
