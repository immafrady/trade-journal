import React from "react";
import {
  createHoldingDetailStore,
  HoldingDetailStore,
} from "@/lib/services/composed/holding-detail-provider";
import { HoldingDetailUpdaterProvider } from "./holding-detail-updater-provider";
import { QuoteUpdater } from "@/lib/services/composed/holding-detail-provider/updaters/quote-updater";

export const HoldingDetailContext =
  React.createContext<HoldingDetailStore | null>(null);

export const HoldingDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = React.useRef<HoldingDetailStore>(null);
  if (!storeRef.current) {
    storeRef.current = createHoldingDetailStore();
  }

  return (
    <HoldingDetailContext.Provider value={storeRef.current}>
      <QuoteUpdater />
      <HoldingDetailUpdaterProvider>{children}</HoldingDetailUpdaterProvider>
    </HoldingDetailContext.Provider>
  );
};
