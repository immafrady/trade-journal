import { DialogEdit } from "@/app/(home)/holdings/[id]/_components/dialog-edit";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingButton } from "@/components/ui/my/button";
import { MyAlertDialog } from "@/components/ui/my/alert-dialog";
import { clearAllTradeRecords } from "@/lib/services/trade-records/trade-record-apis";
import { toast } from "sonner";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import { usePathname } from "next/navigation";
import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { ClipboardPlus, FileUp, Trash } from "lucide-react";

export const BottomBar = () => {
  const { id } = React.useContext(HoldingInfoContext)!;
  const { mutate } = useTradeRecordList(id);
  const [loading, setLoading] = React.useState(false);
  const pathname = usePathname(); // 例如 /holdings/10
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

      <Button variant={"outline"} size={"sm"} asChild>
        <Link href={`${pathname}/import`}>
          <FileUp />
          导入CSV
        </Link>
      </Button>

      <MyAlertDialog
        trigger={
          <LoadingButton
            loading={loading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setLoading(true)}
            icon={<Trash />}
          >
            清除数据
          </LoadingButton>
        }
        title={"确定删除?"}
        description={"一旦删除，所有记录将无法找回"}
        showCancel={true}
        onCancel={() => setLoading(false)}
        onConfirm={async () => {
          try {
            const response = await clearAllTradeRecords(id);
            const { message } = await response.json();
            await mutate([], false);
            toast.success(message);
          } catch (e) {
            console.error("clear data fail:", e);
          } finally {
            setLoading(false);
          }
        }}
      />
    </BottomBarContainer>
  );
};
