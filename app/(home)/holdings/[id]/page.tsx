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
import { useTradeRecordsById } from "@/lib/services/composed/holding-detail-provider";

export default function Page() {
  const { id, data } = React.useContext(HoldingInfoContext);
  const records = useTradeRecordsById(id);
  const [moreInfo, setMoreInfo] = React.useState(true);

  return (
    <AppContainer
      appBar={
        <AppBar bgGradient={moreInfo}>
          {!!data &&
            (moreInfo ? (
              <AppBarExtra
                className={"px-2 -mb-6 relative z-50 pointer-events-auto"}
              >
                <BaseInfo data={data} />
              </AppBarExtra>
            ) : (
              <AppBarExtra title={`${data.ticker.label} · 详情`}></AppBarExtra>
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
