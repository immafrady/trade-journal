"use client";
import React from "react";
import { BaseInfo } from "@/app/(home)/holdings/[id]/_components/base-info";
import { BlankPage } from "@/app/(home)/holdings/[id]/_components/blank-page";
import { DataPage } from "@/app/(home)/holdings/[id]/_components/data-page";
import { cn } from "@/lib/utils";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import {
  useHoldingQuoteById,
  useTradeRecordsById,
} from "@/lib/services/composed/holding-detail-provider";

export default function Page() {
  const { id, ticker } = React.useContext(HoldingInfoContext)!;
  const quote = useHoldingQuoteById(id);
  const records = useTradeRecordsById(id);
  const [moreInfo, setMoreInfo] = React.useState(true);

  return (
    <AppContainer
      appBar={
        <AppBar bgGradient={moreInfo}>
          {!!quote &&
            (moreInfo ? (
              <AppBarExtra
                className={"px-2 -mb-6 relative z-50 pointer-events-auto"}
              >
                <BaseInfo />
              </AppBarExtra>
            ) : (
              <AppBarExtra title={`${ticker.label} · 详情`}></AppBarExtra>
            ))}
        </AppBar>
      }
    >
      <div className={cn("h-full common-layout", moreInfo && "pt-10")}>
        {records.length ? (
          <DataPage onTabChange={setMoreInfo} />
        ) : (
          <BlankPage />
        )}
      </div>
    </AppContainer>
  );
}
