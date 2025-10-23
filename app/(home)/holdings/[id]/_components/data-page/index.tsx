import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "@/app/(home)/holdings/[id]/_components/data-page/tab-summary";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button, LoadingButton } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import { exportAsCSV } from "@/lib/utils";

export const DataPage = ({
  onTabChange,
}: {
  onTabChange: (isSummary: boolean) => void;
}) => {
  const { id, data } = React.useContext(HoldingInfoContext)!;
  const { data: records } = useTradeRecordList(id);
  const [isLoading, setIsLoading] = React.useState(false);
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
            <TabsTrigger value={TabKey.Table}>Password</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={TabKey.Summary}>
          <TabSummary />
        </TabsContent>
        <TabsContent value={TabKey.Table}>
          Change your password here.
        </TabsContent>
      </Tabs>
      <div
        className={
          "fixed bottom-0 left-0 right-0 p-safe-offset-2 flex justify-center gap-4 bg-muted"
        }
      >
        <ButtonGroup>
          <ButtonGroup>
            <Button asChild>
              <Link href={`${pathname}/add`}>新增一条</Link>
            </Button>
            <Button variant={"outline"} asChild>
              <Link href={`${pathname}/import`}>导入CSV</Link>
            </Button>
          </ButtonGroup>
        </ButtonGroup>
        <LoadingButton
          loading={isLoading}
          disabled={!records || !data}
          variant={"outline"}
          onClick={() => {
            setIsLoading(true);
            exportAsCSV(
              `${data!.ticker.label}-操作记录`,
              records!.map((item) => item.toCSVObject()),
            );
            setIsLoading(false);
          }}
        >
          导出CSV
        </LoadingButton>
        <Button variant={"destructive"} asChild>
          <Link href={`${pathname}/import`}>清除数据</Link>
        </Button>
      </div>
    </div>
  );
};

enum TabKey {
  Summary = "summary",
  Table = "table",
}
