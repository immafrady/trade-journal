"use client";

import React from "react";
import { SWRConfig } from "swr";

export function SWRStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        provider: () => {
          const map = new Map<string, any>(
            JSON.parse(localStorage.getItem("app-cache") || "[]"),
          );
          window.addEventListener("beforeunload", () => {
            localStorage.setItem(
              "app-cache",
              JSON.stringify([...map.entries()]),
            );
          });
          return map;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
