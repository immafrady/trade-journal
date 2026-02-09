"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { TradeRecordDraft } from "@/lib/services/composed/holding-detail-provider";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";

export const AlertMessageItem = ({ draft }: { draft: TradeRecordDraft }) => {
  const { holdingId, records } = draft;
  const router = useRouter();
  const { data: list } = useHoldingList();
  const data = React.useMemo(
    () => list?.find((item) => item.id === holdingId),
    [list, holdingId],
  );
  if (data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={"flex items-center justify-between"}>
            <div className={"flex items-center gap-1"}>
              <SinaStockTypeBadge type={data.ticker.type} />
              {data.ticker.label}
            </div>
            <LoadingButton
              variant={"ghost"}
              icon={<ArrowRight />}
              onClick={() => {
                router.push(`/holdings/${holdingId}`);
              }}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className={"font-mono"}>
            {records.map((record, idx) => (
              <li key={record.props.id}>
                {idx + 1}. {record.display.tradedAt} - {record.display.type}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    );
  }
};
