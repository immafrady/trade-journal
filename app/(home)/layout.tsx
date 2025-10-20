"use client";
import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <UserMetaProvider>{children}</UserMetaProvider>;
}
