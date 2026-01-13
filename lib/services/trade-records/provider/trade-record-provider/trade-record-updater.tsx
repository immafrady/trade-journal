import React from "react";
import {
  computeTradeRecordSummary,
  type TradeRecord,
  TradeRecordSummary,
  useTradeRecordList,
} from "@/lib/services/trade-records";

export type TradeRecordUpdaterHandle = {
  update: () => void;
};

export interface TradeRecordData {
  records: TradeRecord[];
  summary: TradeRecordSummary;
}

export const TradeRecordUpdater = React.memo(
  React.forwardRef<
    TradeRecordUpdaterHandle,
    {
      holdingId: string;
      onUpdate: (holdingId: string, data: TradeRecordData) => void;
    }
  >(({ holdingId, onUpdate }, ref) => {
    const { mutate, data = [] } = useTradeRecordList(holdingId);
    const summary = computeTradeRecordSummary(data);
    React.useImperativeHandle(
      ref,
      () => ({
        update: async () => await mutate(),
      }),
      [mutate],
    );
    React.useEffect(() => {
      onUpdate(holdingId, {
        records: data,
        summary,
      });
    }, [data, summary, holdingId, onUpdate]);
    return null;
  }),
);
TradeRecordUpdater.displayName = "TradeRecordUpdater";
