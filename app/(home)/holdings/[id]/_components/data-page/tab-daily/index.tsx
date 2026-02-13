import React from "react";
import { TabDailyContext, TabDailyProvider } from "./_provider";
import { BottomBar } from "./bottom-bar";
import { DailyCard } from "./daily-card";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { useDailySummary } from "@/lib/services/composed/use-daily-summary";

export const TabDaily = () => {
  return (
    <TabDailyProvider>
      <TabDailyInner></TabDailyInner>
    </TabDailyProvider>
  );
};

const TabDailyInner = () => {
  const { index } = React.useContext(TabDailyContext);
  const { id, ticker } = React.useContext(HoldingInfoContext)!;
  const ids = React.useMemo(() => [id], [id]);
  const dailySummaries = useDailySummary(ids);
  const dates = React.useMemo(() => {
    return dailySummaries.map((daily) => daily.date.valueOf());
  }, [dailySummaries]);
  return (
    <>
      <DailyCard daily={dailySummaries[index]} ticker={ticker}></DailyCard>
      <BottomBar dates={dates}></BottomBar>
    </>
  );
};
