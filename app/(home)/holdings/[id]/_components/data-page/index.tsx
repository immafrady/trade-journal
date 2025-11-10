import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "@/app/(home)/holdings/[id]/_components/data-page/tab-summary";
import React from "react";
import { TabBaseData } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data";
import { TabChart } from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart";

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
            <TabsTrigger value={TabKey.BaseData}>基础数据</TabsTrigger>
            <TabsTrigger value={TabKey.Chart}>收益图表</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={TabKey.Summary}>
          <TabSummary />
        </TabsContent>
        <TabsContent value={TabKey.BaseData}>
          <TabBaseData />
        </TabsContent>
        <TabsContent value={TabKey.Chart}>
          <TabChart />
        </TabsContent>
      </Tabs>
    </div>
  );
};

enum TabKey {
  Summary = "summary",
  BaseData = "base-data",
  Chart = "chart",
}
