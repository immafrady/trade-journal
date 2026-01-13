import React from "react";
import type {
  TradeRecord,
  TradeRecordSummary,
} from "@/lib/services/trade-records";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import {
  TradeRecordData,
  TradeRecordUpdater,
  TradeRecordUpdaterHandle,
} from "./trade-record-updater";

interface TradeRecordProviderProps {
  map: { [holdingId: string]: TradeRecordData };
  update: (holdingId: string, data: TradeRecordData) => void;
}

export const TradeRecordContext = React.createContext<TradeRecordProviderProps>(
  {
    map: {},
    update: () => {},
  },
);
export const TradeRecordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const holdingWithQuotes = useHoldingsWithQuote();
  const updaterRefs = React.useRef<
    Record<string, TradeRecordUpdaterHandle | null>
  >({});

  const [map, setMap] = React.useState<{
    [holdingId: string]: TradeRecordData;
  }>({});

  // 更新器
  const onUpdate = React.useCallback(
    (
      holdingId: string,
      data: { records: TradeRecord[]; summary: TradeRecordSummary },
    ) => {
      setMap((m) => ({
        ...m,
        [holdingId]: data,
      }));
    },
    [],
  );
  return (
    <TradeRecordContext.Provider
      value={{
        map,
        update: (holdingId) => updaterRefs.current[holdingId]?.update(),
      }}
    >
      {holdingWithQuotes.map((holdingWithQuote) => {
        return (
          <TradeRecordUpdater
            key={holdingWithQuote.id}
            ref={(el) => {
              updaterRefs.current[holdingWithQuote.id] = el;
            }}
            holdingId={holdingWithQuote.id}
            onUpdate={onUpdate}
          />
        );
      })}
      {children}
    </TradeRecordContext.Provider>
  );
};
