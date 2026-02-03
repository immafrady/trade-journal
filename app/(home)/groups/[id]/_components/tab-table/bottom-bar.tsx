import React from "react";
import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { FileDown } from "lucide-react";
import { GroupInfoContext } from "@/app/(home)/groups/[id]/_providers/group-info";
import { LoadingButton } from "@/components/ui/my/button";
import { exportAsCSV } from "@/lib/utils";
import { TradeRecordExtend } from "@/lib/services/group";

export const BottomBar = ({ records }: { records: TradeRecordExtend[] }) => {
  const group = React.useContext(GroupInfoContext)!;
  const [exportLoading, setExportLoading] = React.useState(false);

  return (
    <BottomBarContainer>
      <LoadingButton
        loading={exportLoading}
        disabled={!records.length}
        variant={"outline"}
        size={"sm"}
        onClick={() => {
          setExportLoading(true);
          exportAsCSV(
            `组合-${group.label}-操作记录`,
            records!.reverse().map((item) => item.toCSVObject()),
          );
          setExportLoading(false);
        }}
        icon={<FileDown />}
      >
        导出CSV
      </LoadingButton>
    </BottomBarContainer>
  );
};
