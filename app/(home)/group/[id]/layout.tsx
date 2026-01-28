"use client";

import React from "react";
import { GroupInfoProvider } from "@/app/(home)/group/[id]/_providers/group-info";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GroupInfoProvider>{children}</GroupInfoProvider>;
}
