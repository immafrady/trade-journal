import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers";
import { SectionDailyProfit } from "./section-daily-profit";
import { SectionHoldingSummary } from "./section-holding-summary";
import { SectionProfitSwitcher } from "./section-profit-switcher";
import { BottomBar } from "./bottom-bar";

export const TabSummary = () => {
  const { id } = React.useContext(HoldingInfoContext)!;

  return (
    <>
      <div className="relative common-layout flex flex-col items-center">
        <div className="w-full max-w-md">
          <SectionDailyProfit id={id} />
          <SectionHoldingSummary id={id} />
          <SectionProfitSwitcher id={id} />
        </div>
      </div>
      <BottomBar />
    </>
  );
};
