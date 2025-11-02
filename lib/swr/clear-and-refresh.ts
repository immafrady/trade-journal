import { mutate, useSWRConfig } from "swr";
import { SWR_STORE_KEY } from "@/lib/swr/local-storage-provider";

export async function clearAndRefresh(key: string) {
  await mutate(key, undefined, false); // 清空内存
  const stored = JSON.parse(localStorage.getItem(SWR_STORE_KEY) || "[]");
  const filtered = stored.filter(([k]: [string, any]) => k !== key);
  localStorage.setItem(SWR_STORE_KEY, JSON.stringify(filtered));
}

export function useClearAllCache() {
  const { cache } = useSWRConfig();
  for (const key of cache.keys()) {
    cache.delete(key);
  }
}

// 清理SWR缓存
export function removeSWRStorage() {
  localStorage.removeItem(SWR_STORE_KEY);
}
