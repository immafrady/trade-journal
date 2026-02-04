import React from "react";
import { useTradeRecordList } from "@/lib/services/trade-records/hooks/use-trade-record-list";
import { useTradeRecordStore } from "@/lib/services/trade-records";

export type TradeRecordUpdaterHandle = {
  update: () => Promise<any>;
};

export const TradeRecordUpdater = React.memo(
  React.forwardRef<
    TradeRecordUpdaterHandle,
    {
      holdingId: string;
    }
  >(({ holdingId }, ref) => {
    const { mutate, data = [] } = useTradeRecordList(holdingId);
    const updateStore = useTradeRecordStore((s) => s.updateStore);
    React.useImperativeHandle(
      ref,
      () => ({
        update: () => mutate(),
      }),
      [mutate],
    );
    React.useEffect(() => {
      updateStore?.(holdingId, data);
    }, [data, holdingId, updateStore]);
    return null;
  }),
);
TradeRecordUpdater.displayName = "TradeRecordUpdater";
