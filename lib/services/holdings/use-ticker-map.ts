import React from "react";
import { SinaTicker } from "@/lib/services/sina";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";

export const useTickerMap = () => {
  const { data: list } = useHoldingList();
  return React.useMemo(() => {
    const m: Record<string, SinaTicker> = {};
    list.forEach((item) => {
      m[item.id] = item.ticker;
    });
    return m;
  }, [list]);
};
