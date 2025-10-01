"use client";
import React from "react";
import { AppHeaderProvider } from "@/app/(home)/_components/app-header";
import { UserMetaProvider } from "@/providers/user-meta";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <div className={"flex flex-col overflow-hidden h-svh"}>
        <AppHeaderProvider>
          <main className={"relative flex-1 overflow-y-auto overflow-x-hidden"}>
            {children}
          </main>
        </AppHeaderProvider>
      </div>
    </UserMetaProvider>
  );
}
