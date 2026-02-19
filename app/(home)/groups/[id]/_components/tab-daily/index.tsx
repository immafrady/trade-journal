import React from "react";
import { BottomBar } from "./bottom-bar";
import { DailyCard } from "./daily-card";
import {
  DataPageContext,
  GroupInfoContext,
} from "@/app/(home)/groups/[id]/_providers";
import { useDailySummary } from "@/lib/services/composed/use-daily-summary";

export const TabDaily = () => {
  const { tabDailyIndex } = React.useContext(DataPageContext);
  const model = React.useContext(GroupInfoContext)!;
  const dailySummaries = useDailySummary(model.holdingIds!);
  const dates = React.useMemo(() => {
    return dailySummaries.map((daily) => daily.date.valueOf());
  }, [dailySummaries]);
  return (
    <>
      <DailyCard daily={dailySummaries[tabDailyIndex]}></DailyCard>
      <BottomBar dates={dates}></BottomBar>
    </>
  );
};
