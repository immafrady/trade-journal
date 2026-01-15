"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradeRecordDraft } from "@/lib/services/trade-records";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import React from "react";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import router from "next/router";

export const AlertMessageItem = ({ draft }: { draft: TradeRecordDraft }) => {
  const { holdingId, records } = draft;
  const list = useHoldingsWithQuote();
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
        <CardContent>1</CardContent>
      </Card>
    );
  }
};
