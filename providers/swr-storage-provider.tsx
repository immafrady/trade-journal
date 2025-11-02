"use client";

import React from "react";
import { mutate, SWRConfig, useSWRConfig } from "swr";

const SWR_STORE_KEY = "app-cache";
let _persist: () => void = () => {};
let _map: Map<string, any> = new Map();

// 主动持久化
export function persistSWRCache() {
  _persist();
}

// 强制清理对应缓存
export async function clearAndRefresh(key: string) {
  await mutate(key, undefined, false); // 清空内存
  const stored = JSON.parse(localStorage.getItem(SWR_STORE_KEY) || "[]");
  const filtered = stored.filter(([k]: [string, any]) => k !== key);
  localStorage.setItem(SWR_STORE_KEY, JSON.stringify(filtered));
}

// 清理SWR缓存
export function useClearAllCache() {
  const { cache } = useSWRConfig();
  for (const key of cache.keys()) {
    cache.delete(key);
  }
}

// 清理SWR持久化内容
export function removeSWRStorage() {
  localStorage.removeItem(SWR_STORE_KEY);
}

export function SWRStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        provider: () => {
          _map = new Map<string, any>(
            JSON.parse(localStorage.getItem(SWR_STORE_KEY) || "[]"),
          );

          // 页面隐藏或卸载时持久化缓存
          _persist = () => {
            const appCache = JSON.stringify(Array.from(_map.entries()));
            localStorage.setItem(SWR_STORE_KEY, appCache);
          };

          window.addEventListener("pagehide", _persist);
          window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") _persist();
          });
          window.addEventListener("beforeunload", _persist);
          return _map;
        },
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
