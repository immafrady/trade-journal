"use client";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";
import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { StepChooseFile } from "@/app/(home)/holdings/[id]/import/_components/step-choose-file";
import { useState } from "react";
import { StepParseError } from "@/app/(home)/holdings/[id]/import/_components/step-parse-error";
import {
  TradeRecord,
  TradeRecordModel,
} from "@/lib/services/trade-records/trade-record";
import { StepPreviewData } from "@/app/(home)/holdings/[id]/import/_components/step-preview-data";
import { addTradeRecords } from "@/lib/services/trade-records/trade-record-apis";
import { toast } from "sonner";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";

export default function Page() {
  const { id, data } = useHoldingInfo();
  const [errors, setErrors] = useState<Error[]>([]);
  const [records, setRecords] = useState<TradeRecord[]>([]);
  const { data: list, mutate } = useTradeRecordList(id);
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
          <StepPreviewData
            records={records}
            onSubmit={async () => {
              const response = await addTradeRecords(records);
              const { data, error } = await response.json();
              if (error && error.message) {
                toast.error(error?.message, { position: "top-center" });
              } else {
                const newRecords = data.map((d: TradeRecordModel) =>
                  TradeRecord.fromDatabase(d),
                );
                await mutate(
                  [...(list ?? []), ...newRecords].sort(
                    // 首先按照日期倒序，其次按照id倒序
                    (a: TradeRecord, b: TradeRecord) => {
                      if (!a.props.tradedAt.isSame(b.props.tradedAt)) {
                        return (
                          b.props.tradedAt.valueOf() -
                          a.props.tradedAt.valueOf()
                        );
                      }
                      return b.props.id! - a.props.id!;
                    },
                  ),
                  false,
                );
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
    </>
  );
}
