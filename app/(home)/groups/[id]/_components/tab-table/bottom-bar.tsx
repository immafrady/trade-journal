import React from "react";
import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { Eraser, FileDown } from "lucide-react";
import {
  DataPageContext,
  GroupInfoContext,
} from "@/app/(home)/groups/[id]/_providers";
import { LoadingButton } from "@/components/ui/my/button";
import { exportAsCSV } from "@/lib/utils";
import { TradeRecordExtend } from "@/lib/services/group";
import { Button } from "@/components/ui/button";

export const BottomBar = ({ records }: { records: TradeRecordExtend[] }) => {
  const group = React.useContext(GroupInfoContext)!;
  const [exportLoading, setExportLoading] = React.useState(false);
  const { columnFilters, setColumnFilters } = React.useContext(DataPageContext);

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
      <Button
        variant={"destructive"}
        size={"sm"}
        disabled={!columnFilters.length}
        onClick={() => {
          setColumnFilters([]);
        }}
      >
        <Eraser />
        清除过滤
      </Button>
    </BottomBarContainer>
  );
};
