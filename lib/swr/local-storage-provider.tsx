"use client";

import React from "react";
import { SWRConfig } from "swr";

export function SWRStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setProvider] = React.useState(() => () => new Map());

  React.useEffect(() => {
    const map = new Map<string, any>(
      JSON.parse(localStorage.getItem("app-cache") || "[]"),
    );
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("app-cache", JSON.stringify([...map.entries()]));
    });
    setProvider(() => () => map);
  }, []);

  return <SWRConfig value={{ provider }}>{children}</SWRConfig>;
}
