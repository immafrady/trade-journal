import React from "react";
import AppHeader from "@/app/(home)/_components/app-header";
import { UserMetaProvider } from "@/providers/user-meta";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <div className={"flex flex-col overflow-hidden h-svh"}>
        <AppHeader />
        <main className={"relative flex-1 overflow-y-auto overflow-x-hidden"}>
          {children}
        </main>
      </div>
    </UserMetaProvider>
  );
}
