"use client";
import React from "react";
import { HoldingInfoProvider } from "@/app/(home)/holdings/[id]/_providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <HoldingInfoProvider>{children}</HoldingInfoProvider>;
}
