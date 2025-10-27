"use client";
import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";
import { SWRConfig } from "swr";
import { localStorageProvider } from "@/lib/swr/local-storage-provider";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <UserMetaProvider>{children}</UserMetaProvider>
    </SWRConfig>
  );
}
