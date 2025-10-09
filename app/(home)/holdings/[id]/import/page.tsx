"use client";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";
import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { Step1 } from "@/app/(home)/holdings/[id]/import/_components/step-1";

export default function Page() {
  const { id, data } = useHoldingInfo();
  return (
    <>
      {
        <AppHeaderPortal>
          {data?.ticker.label && (
            <h1 className={"app-header-title"}>{data?.ticker.label} · 导入</h1>
          )}
        </AppHeaderPortal>
      }
      <div className={"common-layout"}>
        <Step1 />
      </div>
    </>
  );
}
