/// 查列表
import useSWR, { SWRResponse } from "swr";
import { SinaTicker } from "@/lib/services/sina/ticker";

export function useHoldingList(): SWRResponse<
  { id: string; ticker: SinaTicker }[],
  any,
  any
> {
  return useSWR("/api/actions/holdings", async (key) => {
    const response = await fetch(key);
    const { data } = await response.json();
    return (data || []).map((holding: any) => ({
      id: holding.id,
      ticker: new SinaTicker(holding.type, holding.label, holding.code),
    }));
  });
}
