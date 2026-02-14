import React from "react";
import { BottomBar } from "./bottom-bar";
import { DailyCard } from "./daily-card";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { useDailySummary } from "@/lib/services/composed/use-daily-summary";
import { DataPageContext } from "@/app/(home)/holdings/[id]/_components/data-page/_provider";

export const TabDaily = () => {
  const { tabDailyIndex } = React.useContext(DataPageContext);
  const { id, ticker } = React.useContext(HoldingInfoContext)!;
  const ids = React.useMemo(() => [id], [id]);
  const dailySummaries = useDailySummary(ids);
  const dates = React.useMemo(() => {
    return dailySummaries.map((daily) => daily.date.valueOf());
  }, [dailySummaries]);
  return (
    <>
      <DailyCard
        daily={dailySummaries[tabDailyIndex]}
        ticker={ticker}
      ></DailyCard>
      <BottomBar dates={dates}></BottomBar>
    </>
  );
};
