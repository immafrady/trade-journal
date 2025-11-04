import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "@/app/(home)/holdings/[id]/_components/data-page/tab-summary";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import { exportAsCSV } from "@/lib/utils";
import { clearAllTradeRecords } from "@/lib/services/trade-records/trade-record-apis";
import { toast } from "sonner";
import { MyAlertDialog } from "@/components/ui/my/alert-dialog";
import { TabBaseData } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data";
import { DialogEdit } from "@/app/(home)/holdings/[id]/_components/dialog-edit";
import { LoadingButton } from "@/components/ui/my/button";

export const DataPage = ({
  onTabChange,
}: {
  onTabChange: (isSummary: boolean) => void;
}) => {
  const { id, data } = React.useContext(HoldingInfoContext)!;
  const { data: records, mutate } = useTradeRecordList(id);
  const [exportLoading, setExportLoading] = React.useState(false);
  const [clearLoading, setClearLoading] = React.useState(false);
  const pathname = usePathname(); // 例如 /holdings/10

  return (
    <div className={"relative pb-safe-offset-20"}>
      <Tabs
        defaultValue={TabKey.Summary}
        className="w-full"
        onValueChange={(t) => onTabChange(t === TabKey.Summary)}
      >
        <div className={"flex justify-center"}>
          <TabsList>
            <TabsTrigger value={TabKey.Summary}>基本信息</TabsTrigger>
            <TabsTrigger value={TabKey.BaseData}>基础数据</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={TabKey.Summary}>
          <TabSummary />
        </TabsContent>
        <TabsContent value={TabKey.BaseData}>
          <TabBaseData />
        </TabsContent>
      </Tabs>
      <div
        className={
          "fixed bottom-0 left-0 right-0 pb-safe-offset-4 py-safe-offset-2 flex justify-center gap-2 bg-muted"
        }
      >
        <ButtonGroup>
          <ButtonGroup>
            <DialogEdit trigger={<Button size={"sm"}>新增一条</Button>} />
            <Button variant={"outline"} size={"sm"} asChild>
              <Link href={`${pathname}/import`}>导入CSV</Link>
            </Button>
          </ButtonGroup>
        </ButtonGroup>
        <LoadingButton
          loading={exportLoading}
          disabled={!records || !data || clearLoading}
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            setExportLoading(true);
            exportAsCSV(
              `${data!.ticker.label}-操作记录`,
              records!.map((item) => item.toCSVObject()),
            );
            setExportLoading(false);
          }}
        >
          导出CSV
        </LoadingButton>
        <MyAlertDialog
          trigger={
            <LoadingButton
              loading={clearLoading}
              disabled={exportLoading}
              variant={"destructive"}
              size={"sm"}
              onClick={() => setClearLoading(true)}
            >
              清除数据
            </LoadingButton>
          }
          title={"确定删除?"}
          description={"一旦删除，所有记录将无法找回"}
          showCancel={true}
          onCancel={() => setClearLoading(false)}
          onConfirm={async () => {
            try {
              const response = await clearAllTradeRecords(id);
              const { message } = await response.json();
              await mutate([], false);
              toast.success(message);
            } catch (e) {
              console.error("clear data fail:", e);
            } finally {
              setClearLoading(false);
            }
          }}
        />
      </div>
    </div>
  );
};

enum TabKey {
  Summary = "summary",
  BaseData = "base-data",
}
