import React from "react";
import { TradeRecordUpdaterHandle } from "@/lib/services/trade-records";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { HoldingDetailUpdater } from "../updaters/holding-detail-updater";

// 更新器上下文
export const HoldingDetailUpdaterContext = React.createContext<
  (holdingId: string) => Promise<any>
>(() => Promise.resolve());

export const HoldingDetailUpdaterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: holdings } = useHoldingList();

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
    <HoldingDetailUpdaterContext.Provider value={updater}>
      {holdings.map((holding) => (
        <HoldingDetailUpdater
          key={holding.id}
          holdingId={holding.id}
          ref={(el) => {
            updaterRefs.current[holding.id] = el;
          }}
        />
      ))}
      {children}
    </HoldingDetailUpdaterContext.Provider>
  );
};
