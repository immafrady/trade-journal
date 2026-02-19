"use client";

import { DataPageContext, GroupInfoContext } from "./_providers";
import React from "react";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSummary } from "./_components/tab-summary";
import { TabTable } from "./_components/tab-table";
import { TabKey } from "@/app/(home)/groups/[id]/_components/tab-key";
import { TabDaily } from "@/app/(home)/groups/[id]/_components/tab-daily";

export default function Page() {
  const group = React.useContext(GroupInfoContext);
  const { tabKey, setTabKey } = React.useContext(DataPageContext);

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
          <Tabs
            value={tabKey}
            className="w-full"
            onValueChange={(t) => setTabKey(t)}
          >
            <div className={"flex justify-center"}>
              <TabsList>
                <TabsTrigger value={TabKey.Summary}>基本信息</TabsTrigger>
                <TabsTrigger value={TabKey.Table}>数据表格</TabsTrigger>
                <TabsTrigger value={TabKey.Daily}>每日汇总</TabsTrigger>
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
          </Tabs>
        </div>
      </AppContainer>
    );
  }
}
