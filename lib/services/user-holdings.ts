import useSWR, { SWRResponse } from "swr";

export interface UserHolding {
  id: number;
  userId: string;
  createdAt: Date;
  code: string;
  type: string;
}
/// 查列表
export function useHoldingList(): SWRResponse<UserHolding[], any, any> {
  return useSWR("/api/actions/holdings", async (key) => {
    const response = await fetch(key);
    const { data } = await response.json();
    return (data || []).map((holding: any) => ({
      id: holding.id,
      userId: holding.user_id,
      createdAt: new Date(holding.created_at),
      code: holding.code,
      type: holding.type,
    }));
  });
}
// 增

// 删

// 查一条

// 改
