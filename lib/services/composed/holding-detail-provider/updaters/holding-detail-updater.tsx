import React from "react";
import { useTradeRecordList } from "@/lib/services/trade-records/hooks/use-trade-record-list";
import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider";

export type HoldingDetailUpdaterHandle = {
  update: () => Promise<any>;
};

export const HoldingDetailUpdater = React.memo(
  React.forwardRef<
    HoldingDetailUpdaterHandle,
    {
      holdingId: string;
    }
  >(({ holdingId }, ref) => {
    const { mutate, data = [] } = useTradeRecordList(holdingId);
    const updateStore = useHoldingDetailStore((s) => s.updateStore);
    React.useImperativeHandle(
      ref,
      () => ({
        update: () => mutate(),
      }),
      [mutate],
    );
    React.useEffect(() => {
      updateStore(holdingId, data);
    }, [data, holdingId, updateStore]);
    return null;
  }),
);
HoldingDetailUpdater.displayName = "HoldingDetailUpdater";
