import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider";
import { useDailySummary } from "@/lib/services/composed/use-daily-summary";
import React from "react";
import { computeDailyProfit } from "@/lib/compute";

export const useDailyProfit = (holdingIds: string[]) => {
  const quoteMap = useHoldingDetailStore((s) => s.quoteStore);
  const dailySummary = useDailySummary(holdingIds);
  return React.useMemo(() => {
    return dailySummary[0]
      ? computeDailyProfit(dailySummary[0], quoteMap)
      : null;
  }, [dailySummary, quoteMap]);
};
