/// 查列表
import useSWR from "swr";
import { SinaTicker } from "@/lib/services/sina/ticker";
import React from "react";

export function useHoldingList() {
  const { data: list = [], ...swr } = useSWR(
    "/api/actions/holdings",
    async (key) => {
      const response = await fetch(key);
      const { data } = await response.json();
      return data;
    },
  );

  const data: { id: string; ticker: SinaTicker }[] = React.useMemo(() => {
    return list.map((holding: any) => ({
      id: holding.id + "",
      ticker: new SinaTicker(holding.type, holding.label, holding.code),
    }));
  }, [list]);

  return { ...swr, data };
}
