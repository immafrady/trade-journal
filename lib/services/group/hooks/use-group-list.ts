import useSWR from "swr";
import { GroupModel } from "@/lib/services/group";

const key = "/api/actions/groups";
export const useGroupList = () => {
  return useSWR(key, async (key) => {
    const response = await fetch(key);
    const { data: list = [] } = await response.json();
    return list.map((item: any) => ({
      ...item,
      holdingIds: (item.group_holdings ?? []).map(
        (sub: { holding_id: number }) => sub.holding_id,
      ),
    })) as GroupModel[];
  });
};
