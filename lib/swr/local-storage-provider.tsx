"use client";

import React from "react";
import { SWRConfig } from "swr";

export const SWR_STORE_KEY = "app-cache";
let _persist: () => void = () => {};
let _map: Map<string, any> = new Map();

// 主动持久化
export function persistSWRCache() {
  _persist();
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
      }}
    >
      {children}
    </SWRConfig>
  );
}
