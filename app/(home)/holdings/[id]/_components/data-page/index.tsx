import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "./tab-summary";
import React from "react";
import { TabTable } from "./tab-table";

export const DataPage = ({
  onTabChange,
}: {
  onTabChange: (isSummary: boolean) => void;
}) => {
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
            <TabsTrigger value={TabKey.Table}>数据表格</TabsTrigger>
            {/*<TabsTrigger value={TabKey.Chart}>收益图表</TabsTrigger>*/}
          </TabsList>
        </div>

        <TabsContent value={TabKey.Summary}>
          <TabSummary />
        </TabsContent>
        <TabsContent value={TabKey.Table}>
          <TabTable />
        </TabsContent>
        {/*<TabsContent value={TabKey.Chart}>*/}
        {/*  <TabChart />*/}
        {/*</TabsContent>*/}
      </Tabs>
    </div>
  );
};

enum TabKey {
  Summary = "summary",
  Table = "table",
  Chart = "chart",
}
