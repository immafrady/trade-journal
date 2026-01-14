"use client";
import React from "react";
import {
  createTradeRecordStore,
  TradeRecordStore,
} from "@/lib/services/trade-records";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import {
  TradeRecordUpdater,
  TradeRecordUpdaterHandle,
} from "./trade-record-updater";

// 上下文
export const TradeRecordContext = React.createContext<TradeRecordStore | null>(
  null,
);
export const TradeRecordUpdaterContext = React.createContext<
  (holdingId: string) => Promise<any>
>(() => Promise.resolve());

// 真正的provider
export const TradeRecordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = React.useRef<TradeRecordStore>(null);
  if (!storeRef.current) {
    storeRef.current = createTradeRecordStore();
  }
  const holdingWithQuotes = useHoldingsWithQuote();
  const updaterRefs = React.useRef<
    Record<string, TradeRecordUpdaterHandle | null>
  >({});

  // 更新器
  const updater = React.useCallback(
    (holdingId: string) => {
      return updaterRefs.current[holdingId]?.update() ?? Promise.resolve();
    },
    [updaterRefs],
  );
  return (
    <TradeRecordContext.Provider value={storeRef.current}>
      {holdingWithQuotes.map((holdingWithQuote) => {
        return (
          <TradeRecordUpdater
            key={holdingWithQuote.id}
            ref={(el) => {
              updaterRefs.current[holdingWithQuote.id] = el;
            }}
            holdingId={holdingWithQuote.id}
          />
        );
      })}
      <TradeRecordUpdaterContext.Provider value={updater}>
        {children}
      </TradeRecordUpdaterContext.Provider>
    </TradeRecordContext.Provider>
  );
};
