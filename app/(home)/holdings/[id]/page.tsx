"use client";
import React from "react";
import { BaseInfo } from "@/app/(home)/holdings/[id]/_components/base-info";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import Loading from "@/components/ui/my/loading";
import { BlankPage } from "@/app/(home)/holdings/[id]/_components/blank-page";
import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { DataPage } from "@/app/(home)/holdings/[id]/_components/data-page";
import { cn } from "@/lib/utils";
import {
  AppBar,
  AppBarExtra,
  AppBarExtraContent,
  AppBarTitle,
  AppContainer,
} from "@/components/ui/my/app-container";

export default function Page() {
  const { id, data } = useHoldingInfo();
  const { isLoading, data: records } = useTradeRecordList(id);
  const [moreInfo, setMoreInfo] = React.useState(true);

  return (
    <AppContainer
      appBar={
        <AppBar bgGradient={moreInfo}>
          <AppBarExtra>
            {data &&
              (moreInfo ? (
                <AppBarExtraContent
                  className={"px-2 -mb-6 relative z-50 pointer-events-auto"}
                >
                  <BaseInfo data={data} />
                </AppBarExtraContent>
              ) : (
                <AppBarTitle>{data.ticker.label} · 详情</AppBarTitle>
              ))}
          </AppBarExtra>
        </AppBar>
      }
    >
      <div className={cn("h-full common-layout", moreInfo && "pt-10")}>
        {records?.length ? (
          <DataPage onTabChange={setMoreInfo} />
        ) : (
          <BlankPage />
        )}
        <Loading isLoading={isLoading} fullScreen={true} />
      </div>
    </AppContainer>
  );
}
