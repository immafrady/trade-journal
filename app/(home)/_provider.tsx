import React from "react";
import {
  HoldingWithQuote,
  useHoldingsWithQuote,
} from "@/lib/services/composed/use-holdings-with-quote";
import { useTradeRecordStore } from "@/lib/services/trade-records/provider/trade-record-provider/trade-record-store";

interface HomeProviderProps {
  list: HoldingWithQuoteExtend[];
  totalAmount: number;
  maxTotalAmount: number;
}

export const HomeContext = React.createContext<HomeProviderProps>({
  list: [],
  totalAmount: 0,
  maxTotalAmount: 0,
});

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useTradeRecordStore((s) => s.store);
  const raws = useHoldingsWithQuote();

  const data = Object.values(store)
    .map((item) => item.summary)
    .reduce(
      (prev, curr) => {
        return {
          totalAmount: prev.totalAmount + curr.totalAmount,
          maxTotalAmount: prev.maxTotalAmount + curr.maxTotalAmount,
        };
      },
      {
        totalAmount: 0,
        maxTotalAmount: 0,
      },
    );

  const list: HoldingWithQuoteExtend[] = raws
    .filter((item) => {
      return !!store[item.id];
    })
    .map((item) => {
      const summary = store[item.id].summary;
      return {
        ...item,
        proportion:
          data.totalAmount && summary
            ? (summary.totalAmount / data.totalAmount) * 100
            : 0,
      };
    })
    .sort((a, b) => b.proportion - a.proportion);

  return (
    <HomeContext.Provider
      value={{
        list,
        totalAmount: data.totalAmount,
        maxTotalAmount: data.maxTotalAmount,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export interface HoldingWithQuoteExtend extends HoldingWithQuote {
  proportion: number;
}
