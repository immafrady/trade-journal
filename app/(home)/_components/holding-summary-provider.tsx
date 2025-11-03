import React from "react";
import { TradeRecordSummary } from "@/lib/services/trade-records/use-trade-record-summary";

interface HoldingSummaryProviderProps {
  totalAmount: number;
  maxTotalAmount: number;
  updateData: (id: string, summary: TradeRecordSummary) => void;
}

export const HoldingSummaryContext =
  React.createContext<HoldingSummaryProviderProps>({
    totalAmount: 0,
    maxTotalAmount: 0,
    updateData: () => {},
  });

export const HoldingSummaryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  return (
    <HoldingSummaryContext.Provider
      value={{
        totalAmount: data.totalAmount,
        maxTotalAmount: data.maxTotalAmount,
        updateData: (id, summary) => {
          setMap((m) => ({ ...m, [id]: summary }));
        },
      }}
    >
      {children}
    </HoldingSummaryContext.Provider>
  );
};
