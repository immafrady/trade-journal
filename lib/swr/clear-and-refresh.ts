import { mutate, useSWRConfig } from "swr";

export async function clearAndRefresh(key: string) {
  await mutate(key, undefined, false); // 清空内存
  const stored = JSON.parse(localStorage.getItem("app-cache") || "[]");
  const filtered = stored.filter(([k]: [string, any]) => k !== key);
  localStorage.setItem("app-cache", JSON.stringify(filtered));
}

export function useClearAllCache() {
  const { cache } = useSWRConfig();
  for (const key of cache.keys()) {
    cache.delete(key);
  }
}

// 清理SWR缓存
export function removeSWRStorage() {
  localStorage.removeItem("app-cache");
}
