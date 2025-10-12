"use client";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";
import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { StepChooseFile } from "@/app/(home)/holdings/[id]/import/_components/step-choose-file";
import { useState } from "react";
import { StepParseError } from "@/app/(home)/holdings/[id]/import/_components/step-parse-error";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { StepPreviewData } from "@/app/(home)/holdings/[id]/import/_components/step-preview-data";

export default function Page() {
  const { id, data } = useHoldingInfo();
  const [errors, setErrors] = useState<Error[]>([]);
  const [records, setRecords] = useState<TradeRecord[]>([]);
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
        {records.length ? (
          <StepPreviewData records={records} onRedo={() => setRecords([])} />
        ) : errors.length ? (
          <StepParseError
            errors={errors}
            onRedo={() => {
              setErrors([]);
            }}
          />
        ) : (
          <StepChooseFile
            onPick={(r) => {
              setRecords(r);
            }}
            onErrors={(e) => {
              setErrors(e);
            }}
          />
        )}
      </div>
    </>
  );
}
