"use client";

import React from "react";
import {
  DataPageProvider,
  GroupInfoProvider,
} from "@/app/(home)/groups/[id]/_providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GroupInfoProvider>
      <DataPageProvider>{children}</DataPageProvider>
    </GroupInfoProvider>
  );
}
