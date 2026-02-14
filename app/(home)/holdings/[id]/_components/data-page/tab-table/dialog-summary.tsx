import { TradeRecord, TradeRecordType } from "@/lib/services/trade-records";
import React from "react";
import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { SelectedSummary } from "@/app/(home)/holdings/[id]/_components/data-page/selected-summary";

const description = `仅${[
  TradeRecordType.Buy,
  TradeRecordType.Sell,
  TradeRecordType.Subscribe,
  TradeRecordType.Redeem,
  TradeRecordType.Dividend,
]
  .map((t) => t.label)
  .join("、")}类型的交易参与汇总计算`;

export const DialogSummary = ({
  disabled,
  records,
}: {
  disabled: boolean;
  records: TradeRecord[];
}) => {
  const [displayRecords, setDisplayRecords] = React.useState<TradeRecord[]>([]);
  return (
    <ResponsiveDialog
      title={`汇总展示(${records.length}条)`}
      description={description}
      trigger={
        <Button disabled={disabled} variant={"outline"} size={"sm"}>
          <Layers />
          汇总展示
        </Button>
      }
      onOpen={() => {
        setDisplayRecords(records);
      }}
      onClosed={() => setDisplayRecords([])}
    >
      <SelectedSummary records={displayRecords}></SelectedSummary>
    </ResponsiveDialog>
  );
};
