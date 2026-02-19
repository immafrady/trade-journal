import { DialogEdit } from "@/app/(home)/holdings/[id]/_components/dialog-edit";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/my/button";
import { exportAsCSV } from "@/lib/utils";
import { MyAlertDialog } from "@/components/ui/my/alert-dialog";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers";
import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { ClipboardPlus, FileDown, Trash2 } from "lucide-react";
import { useTradeRecordsById } from "@/lib/services/composed/holding-detail-provider";

export const BottomBar = ({
  selectedRowCount,
  onDeleteConfirm,
}: {
  selectedRowCount: number;
  onDeleteConfirm: () => Promise<void>;
}) => {
  const { id, ticker } = React.useContext(HoldingInfoContext)!;
  const records = useTradeRecordsById(id);
  const [exportLoading, setExportLoading] = React.useState(false);
  const [clearLoading, setClearLoading] = React.useState(false);
  return (
    <BottomBarContainer>
      <DialogEdit
        trigger={
          <Button size={"sm"}>
            <ClipboardPlus />
            新增一条
          </Button>
        }
      />

      <LoadingButton
        loading={exportLoading}
        disabled={!records || clearLoading}
        variant={"outline"}
        size={"sm"}
        onClick={() => {
          setExportLoading(true);
          exportAsCSV(
            `${ticker.label}-操作记录`,
            records!
              .reverse()
              .map((item) => item.toCSVObject(ticker.formatter)),
          );
          setExportLoading(false);
        }}
        icon={<FileDown />}
      >
        导出CSV
      </LoadingButton>

      <MyAlertDialog
        trigger={
          <LoadingButton
            loading={clearLoading}
            disabled={exportLoading || !selectedRowCount}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setClearLoading(true)}
            icon={<Trash2 />}
          >
            勾选删除
          </LoadingButton>
        }
        title={`确定删除${selectedRowCount}条数据?`}
        description={"一旦删除，所有记录将无法找回"}
        showCancel={true}
        onCancel={() => setClearLoading(false)}
        onConfirm={async () => {
          try {
            await onDeleteConfirm();
          } finally {
            setClearLoading(false);
          }
        }}
      />
    </BottomBarContainer>
  );
};
