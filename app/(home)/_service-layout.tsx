"use client";
import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";
import { HoldingDetailProvider } from "@/lib/services/composed/holding-detail-provider";

export function ServiceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <HoldingDetailProvider>{children}</HoldingDetailProvider>
    </UserMetaProvider>
  );
}
