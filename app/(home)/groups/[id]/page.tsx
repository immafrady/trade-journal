"use client";

import { GroupInfoContext } from "./_providers/group-info";
import React from "react";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "./_components/tab-summary";
import { TabTable } from "./_components/tab-table";

export default function Page() {
  const group = React.useContext(GroupInfoContext);

  if (group) {
    return (
      <AppContainer
        appBar={
          <AppBar>
            <AppBarExtra title={`组合 · ${group.label}`}></AppBarExtra>
          </AppBar>
        }
      >
        <div className={"common-layout relative pb-safe-offset-20"}>
          <Tabs defaultValue={TabKey.Summary} className="w-full">
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
              <TabTable />
            </TabsContent>
          </Tabs>
        </div>
      </AppContainer>
    );
  }
}

enum TabKey {
  Summary = "summary",
  BaseData = "base-data",
}
