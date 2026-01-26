import useSWR from "swr";
import { GroupModel } from "@/lib/services/group";

const key = "/api/actions/groups";
export const useGroupList = () => {
  return useSWR(key, async (key) => {
    const response = await fetch(key);
    const { data } = await response.json();
    return data as GroupModel[];
  });
};
