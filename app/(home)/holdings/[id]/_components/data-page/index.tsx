import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "./tab-summary";
import React from "react";
import { TabTable } from "./tab-table";
import { TabDaily } from "./tab-daily";
import { DataPageContext, TabKey } from "@/app/(home)/holdings/[id]/_providers";

export const DataPage = ({
  onTabChange,
}: {
  onTabChange: (isSummary: boolean) => void;
}) => {
  const { tabKey, setTabKey } = React.useContext(DataPageContext);

  return (
    <div className={"relative pb-safe-offset-20"}>
      <Tabs
        value={tabKey}
        className="w-full"
        onValueChange={(t) => {
          setTabKey(t);
          onTabChange(t === TabKey.Summary);
        }}
      >
        <div className={"flex justify-center"}>
          <TabsList>
            <TabsTrigger value={TabKey.Summary}>基本信息</TabsTrigger>
            <TabsTrigger value={TabKey.Table}>数据表格</TabsTrigger>
            <TabsTrigger value={TabKey.Daily}>每日汇总</TabsTrigger>
            {/*<TabsTrigger value={TabKey.Chart}>收益图表</TabsTrigger>*/}
          </TabsList>
        </div>

        <TabsContent value={TabKey.Summary}>
          <TabSummary />
        </TabsContent>
        <TabsContent value={TabKey.Table}>
          <TabTable />
        </TabsContent>
        <TabsContent value={TabKey.Daily}>
          <TabDaily />
        </TabsContent>
        {/*<TabsContent value={TabKey.Chart}>*/}
        {/*  <TabChart />*/}
        {/*</TabsContent>*/}
      </Tabs>
    </div>
  );
};
