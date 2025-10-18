"use client";
import React from "react";
import { BaseInfo } from "@/app/(home)/holdings/[id]/_components/base-info";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import Loading from "@/components/ui/my/loading";
import { BlankPage } from "@/app/(home)/holdings/[id]/_components/blank-page";
import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { DataPage } from "@/app/(home)/holdings/[id]/_components/data-page";

export default function Page() {
  const { id, data } = useHoldingInfo();
  const { isLoading, data: records } = useTradeRecordList(id);
  const [moreInfo, setMoreInfo] = React.useState(true);

  return (
    <>
      {data && (
        <AppHeaderPortal>
          <h1
            className={
              moreInfo
                ? "px-2 -mt-5 translate-y-6 relative z-50 pointer-events-auto"
                : "app-header-title"
            }
          >
            {moreInfo ? (
              <BaseInfo data={data} />
            ) : (
              <div>{data.ticker.label} · 详情</div>
            )}
          </h1>
        </AppHeaderPortal>
      )}
      <div className={"h-full common-layout pt-10"}>
        {records?.length ? (
          <DataPage onTabChange={setMoreInfo} />
        ) : (
          <BlankPage />
        )}
        <Loading isLoading={isLoading} fullScreen={true} />
      </div>
    </>
  );
}
