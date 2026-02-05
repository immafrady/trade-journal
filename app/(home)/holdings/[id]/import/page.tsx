"use client";
import { StepChooseFile } from "@/app/(home)/holdings/[id]/import/_components/step-choose-file";
import React from "react";
import { StepParseError } from "@/app/(home)/holdings/[id]/import/_components/step-parse-error";
import { addTradeRecords, TradeRecord } from "@/lib/services/trade-records";
import { StepPreviewData } from "@/app/(home)/holdings/[id]/import/_components/step-preview-data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { HoldingDetailUpdaterContext } from "@/lib/services/composed/holding-detail-provider";

export default function Page() {
  const { id, data } = React.useContext(HoldingInfoContext);
  const updater = React.useContext(HoldingDetailUpdaterContext);
  const [errors, setErrors] = React.useState<Error[]>([]);
  const [records, setRecords] = React.useState<TradeRecord[]>([]);

  const router = useRouter();
  return (
    <AppContainer
      appBar={
        <AppBar>
          {data?.ticker.label && (
            <AppBarExtra title={`${data.ticker.label} · 导入`}></AppBarExtra>
          )}
        </AppBar>
      }
    >
      <div className={"common-layout"}>
        {records.length ? (
          <StepPreviewData
            records={records}
            onSubmit={async () => {
              const response = await addTradeRecords(records);
              const { error } = await response.json();
              if (error) {
                toast.error(error);
              } else {
                await updater(id);
                toast.success(`成功插入${records.length}条数据`);
                router.replace(`/holdings/${id}`);
              }
            }}
            onRedo={() => setRecords([])}
          />
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
    </AppContainer>
  );
}
