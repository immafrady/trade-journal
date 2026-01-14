"use client";
import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";
import { TradeRecordProvider } from "@/lib/services/trade-records";

export function ServiceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <TradeRecordProvider>{children}</TradeRecordProvider>
    </UserMetaProvider>
  );
}
