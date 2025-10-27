import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";
import { SWRStorageProvider } from "@/lib/swr/local-storage-provider";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SWRStorageProvider>
        <UserMetaProvider>{children}</UserMetaProvider>
      </SWRStorageProvider>
    </>
  );
}
