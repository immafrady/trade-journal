import React from "react";
import { TradeRecordSummary } from "@/lib/services/trade-records/use-trade-record-summary";
import {
  HoldingWithQuote,
  useHoldingsWithQuote,
} from "@/lib/services/composed/use-holdings-with-quote";

interface HomeProviderProps {
  list: HoldingWithQuoteExtend[];
  totalAmount: number;
  maxTotalAmount: number;
  updateData: (id: string, summary: TradeRecordSummary) => void;
}

export const HomeContext = React.createContext<HomeProviderProps>({
  list: [],
  totalAmount: 0,
  maxTotalAmount: 0,
  updateData: () => {},
});

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const raws = useHoldingsWithQuote();
  const [map, setMap] = React.useState<Record<string, TradeRecordSummary>>({});

  const data = Object.values(map).reduce(
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
    .map((item) => {
      const summary = map[item.id];
      return {
        ...item,
        summary,
        proportion: data.totalAmount
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
        updateData: (id, summary) => {
          setMap((m) => ({ ...m, [id]: summary }));
        },
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export interface HoldingWithQuoteExtend extends HoldingWithQuote {
  summary: TradeRecordSummary;
  proportion: number;
}
