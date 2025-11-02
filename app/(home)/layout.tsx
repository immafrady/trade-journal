import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";
import { ClientOnly } from "@/components/client-only";
import { SWRStorageProvider } from "@/providers/swr-storage-provider";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ClientOnly>
        <SWRStorageProvider>
          <UserMetaProvider>{children}</UserMetaProvider>
        </SWRStorageProvider>
      </ClientOnly>
    </>
  );
}
