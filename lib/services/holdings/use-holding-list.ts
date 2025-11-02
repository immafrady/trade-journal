/// 查列表
import useSWR from "swr";
import { SinaTicker } from "@/lib/services/sina/ticker";
import React from "react";
import { persistSWRCache } from "@/providers/swr-storage-provider";

const key = "/api/actions/holdings";

export function useHoldingList() {
  const { data: list = [], ...swr } = useSWR(key, async (key) => {
    const response = await fetch(key);
    const { data } = await response.json();
    return data;
  });

  const data: { id: string; ticker: SinaTicker }[] = React.useMemo(() => {
    try {
      return list.map((holding: any) => ({
        id: holding.id + "",
        ticker: new SinaTicker(holding.type, holding.label, holding.code),
      }));
    } catch (e) {
      console.error(key, e);
      return [];
    }
  }, [list]);
  persistSWRCache();
  return { ...swr, data };
}
