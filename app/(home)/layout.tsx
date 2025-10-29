import React from "react";
import { UserMetaProvider } from "@/providers/user-meta";
import { SWRStorageProvider } from "@/lib/swr/local-storage-provider";
import { ClientOnly } from "@/components/client-only";

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
