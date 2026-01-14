import React from "react";
import { useTradeRecordList } from "@/lib/services/trade-records";
import { useTradeRecordStore } from "@/lib/services/trade-records/provider/trade-record-provider/trade-record-store";

export type TradeRecordUpdaterHandle = {
  update: () => void;
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
        update: async () => await mutate(),
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
