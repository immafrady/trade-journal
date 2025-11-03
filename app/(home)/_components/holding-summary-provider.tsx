import React from "react";
import { TradeRecordSummary } from "@/lib/services/trade-records/use-trade-record-summary";

interface HoldingSummaryProviderProps {
  map: Record<string, TradeRecordSummary>;
  updateMap: (id: string, summary: TradeRecordSummary) => void;
}

export const HoldingSummaryContext =
  React.createContext<HoldingSummaryProviderProps>({
    map: {},
    updateMap: () => {},
  });

export const HoldingSummaryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [map, setMap] = React.useState<Record<string, TradeRecordSummary>>({});

  return (
    <HoldingSummaryContext.Provider
      value={{
        map,
        updateMap: (id, summary) => {
          setMap((m) => ({ ...m, [id]: summary }));
        },
      }}
    >
      {children}
    </HoldingSummaryContext.Provider>
  );
};
